<template>
  <div class="equipment-list">
    <div class="header">
      <h2>设备列表</h2>
      <div class="actions">
        <div class="search-bar">
          <el-cascader
            v-model="searchForm.categoryId"
            :options="categories"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'id',
              emitPath: false
            }"
            placeholder="设备分类"
            clearable
            class="category-select" />
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索设备名称/编号"
            clearable
            @clear="handleSearch"
            class="search-input">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增设备
        </el-button>
      </div>
    </div>

    <el-table :data="equipmentList" style="width: 100%" v-loading="loading">
      <el-table-column prop="code" label="设备编号" width="120" />
      <el-table-column prop="name" label="设备名称" width="180" />
      <el-table-column prop="categoryName" label="分类" width="120" />
      <el-table-column prop="model" label="型号" width="120">
        <template #default="{ row }">
          <el-tag size="small" effect="plain">{{ row.model }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格参数" show-overflow-tooltip />
      <el-table-column prop="price" label="售价" width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.price) }}
        </template>
      </el-table-column>
      <el-table-column prop="rentPrice" label="租赁价(天)" width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.rentPrice) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            size="small" 
            type="success"
            @click="handleInventory(row)">
            库存
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <equipment-form
      v-model:visible="formVisible"
      :is-edit="isEdit"
      :equipment-data="currentEquipment"
      :categories="categories"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { EquipmentForm } from '@/components/equipment'
import { equipmentService } from '@/services/equipmentService'
import { formatAmount } from '@/utils/format'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchForm = ref({
  keyword: '',
  categoryId: null
})
const equipmentList = ref([])
const categories = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const formVisible = ref(false)
const isEdit = ref(false)
const currentEquipment = ref(null)
const loading = ref(false)

const getStatusType = (status) => {
  const types = {
    '在库': 'success',
    '租出': 'warning',
    '维修中': 'info'
  }
  return types[status] || 'info'
}

const loadData = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await equipmentService.getEquipments({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    equipmentList.value = list
    total.value = totalCount
  } catch (error) {
    ElMessage.error('获取设备列表失败')
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await equipmentService.getCategories()
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleAdd = () => {
  isEdit.value = false
  currentEquipment.value = null
  formVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentEquipment.value = { ...row }
  formVisible.value = true
}

const handleInventory = (row) => {
  router.push(`/equipment/inventory/${row.id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除设备 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await equipmentService.deleteEquipment(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleFormSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      await equipmentService.updateEquipment(currentEquipment.value.id, formData)
      ElMessage.success('更新成功')
    } else {
      await equipmentService.createEquipment(formData)
      ElMessage.success('创建成功')
    }
    formVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

onMounted(() => {
  loadCategories()
  loadData()
})
</script>

<style scoped>
.equipment-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 16px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.category-select {
  width: 160px;
}

.search-input {
  width: 200px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>