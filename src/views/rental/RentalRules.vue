<template>
  <div class="rental-rules">
    <div class="header">
      <h2>租赁规则管理</h2>
      <div class="actions">
        <div class="search-bar">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索规则名称/编号"
            clearable
            @clear="handleSearch"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select 
            v-model="searchForm.type" 
            placeholder="规则类型"
            clearable
            class="search-select"
          >
            <el-option label="租金规则" value="rent" />
            <el-option label="押金规则" value="deposit" />
            <el-option label="超时规则" value="overtime" />
            <el-option label="损坏赔偿" value="damage" />
          </el-select>
          <el-select 
            v-model="searchForm.status" 
            placeholder="规则状态"
            clearable
            class="search-select"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增规则
        </el-button>
      </div>
    </div>

    <el-table 
      :data="ruleList" 
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column prop="categoryName" label="设备分类" min-width="120">
        <template #default="{ row }">
          {{ getCategoryName(row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column label="租期限制" width="200">
        <template #default="{ row }">
          <span class="duration">
            {{ row.minDuration }}-{{ row.maxDuration }}
            <span class="unit">天</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="depositAmount" label="押金" min-width="120">
        <template #default="{ row }">
          <money-amount :amount="row.depositAmount" />
        </template>
      </el-table-column>
      <el-table-column prop="dailyRate" label="日租金" min-width="120">
        <template #default="{ row }">
          <money-amount :amount="row.dailyRate" />
        </template>
      </el-table-column>
      <el-table-column prop="overdueFee" label="逾期费用/天" min-width="140">
        <template #default="{ row }">
          <money-amount :amount="row.overdueFee" />
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="状态" width="100">
        <template #default="{ row }">
          <el-tag 
            :type="row.isActive ? 'success' : 'info'"
            effect="plain"
          >
            {{ row.isActive ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button 
            link
            type="primary" 
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button 
            link
            type="danger" 
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <rule-form
      v-model:visible="formVisible"
      :rule-data="currentRule"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { MoneyAmount, RuleForm } from '@/components/rental'
import { rentalService } from '@/services/rentalService'

const ruleList = ref([
  {
    id: 1,
    categoryId: 1,
    minDuration: 1,
    maxDuration: 30,
    depositAmount: 5000,
    dailyRate: 200,
    overdueFee: 300,
    isActive: true
  },
  {
    id: 2,
    categoryId: 2,
    minDuration: 7,
    maxDuration: 90,
    depositAmount: 10000,
    dailyRate: 500,
    overdueFee: 800,
    isActive: true
  },
  {
    id: 3,
    categoryId: 3,
    minDuration: 1,
    maxDuration: 7,
    depositAmount: 2000,
    dailyRate: 100,
    overdueFee: 150,
    isActive: false
  }
])

const formVisible = ref(false)
const currentRule = ref(null)
const loading = ref(false)

const searchForm = ref({
  keyword: '',
  type: '',
  status: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 设备分类映射
const categoryMap = {
  1: '专业无人机',
  2: '航拍无人机',
  3: '配件设备'
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  return categoryMap[categoryId] || '未知分类'
}

// 模拟加载数据
const loadRules = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 过滤数据
    let filteredList = [...ruleList.value]
    
    if (searchForm.value.keyword) {
      const keyword = searchForm.value.keyword.toLowerCase()
      filteredList = filteredList.filter(rule => 
        getCategoryName(rule.categoryId).toLowerCase().includes(keyword)
      )
    }
    
    if (searchForm.value.type) {
      // 根据类型过滤
    }
    
    if (searchForm.value.status !== '') {
      filteredList = filteredList.filter(rule => 
        rule.isActive === (searchForm.value.status === 1)
      )
    }
    
    // 计算分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    const paginatedList = filteredList.slice(start, end)
    total.value = filteredList.length
    
    ruleList.value = paginatedList
  } catch (error) {
    ElMessage.error('获取租赁规则失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  currentRule.value = null
  formVisible.value = true
}

const handleEdit = (row) => {
  currentRule.value = { ...row }
  formVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认要删除该租赁规则吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = ruleList.value.findIndex(rule => rule.id === row.id)
    if (index !== -1) {
      ruleList.value.splice(index, 1)
      ElMessage.success('删除成功')
      loadRules()
    }
  })
}

const handleSubmit = async (formData) => {
  try {
    if (currentRule.value) {
      // 更新现有规则
      const index = ruleList.value.findIndex(rule => rule.id === currentRule.value.id)
      if (index !== -1) {
        ruleList.value[index] = {
          ...currentRule.value,
          ...formData
        }
      }
      ElMessage.success('更新成功')
    } else {
      // 添加新规则
      ruleList.value.push({
        id: Date.now(), // 模拟ID生成
        ...formData,
        isActive: true
      })
      ElMessage.success('创建成功')
    }
    formVisible.value = false
    loadRules()
  } catch (error) {
    ElMessage.error(currentRule.value ? '更新失败' : '创建失败')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadRules()
}

const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    type: '',
    status: ''
  }
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadRules()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadRules()
}

onMounted(() => {
  loadRules()
})
</script>

<style scoped>
.rental-rules {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-weight: 500;
    color: #303133;
  }
}

.actions {
  display: flex;
  gap: 16px;
}

.duration {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.unit {
  color: #909399;
  font-size: 13px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.search-select {
  width: 160px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-button--link) {
  padding: 4px 8px;
}
</style>