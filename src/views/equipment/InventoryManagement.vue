<template>
  <div class="inventory-management">
    <div class="header">
      <h2>设备库存管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增库存
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="设备名称">
          <el-input v-model="searchForm.name" placeholder="请输入设备名称" clearable />
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input v-model="searchForm.model" placeholder="请输入设备型号" clearable />
        </el-form-item>
        <el-form-item label="存放位置">
          <el-select v-model="searchForm.location" placeholder="请选择" clearable>
            <el-option label="仓库A" value="仓库A" />
            <el-option label="仓库B" value="仓库B" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="正常" value="正常" />
            <el-option label="低库存" value="低库存" />
            <el-option label="缺货" value="缺货" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 库存统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总库存数量</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.total }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>低库存预警</span>
            </div>
          </template>
          <div class="card-content warning">{{ statistics.warning }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月入库</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.inbound }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月出库</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.outbound }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 库存列表 -->
    <el-table :data="inventoryList" v-loading="loading" style="width: 100%">
      <el-table-column prop="name" label="设备名称" width="150" />
      <el-table-column prop="model" label="型号" width="120" />
      <el-table-column prop="quantity" label="库存数量" width="100" />
      <el-table-column prop="minQuantity" label="最低库存" width="100" />
      <el-table-column prop="location" label="存放位置" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdate" label="最后更新" width="180" />
      <el-table-column label="操作" fixed="right" width="250">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="success" @click="handleRecord(row)">
            变动记录
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row)"
            :disabled="row.quantity > 0">
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

    <!-- 新增/编辑表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑库存' : '新增库存'"
      width="500px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="设备型号" prop="model">
          <el-input v-model="form.model" />
        </el-form-item>
        <el-form-item label="库存数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="0" />
        </el-form-item>
        <el-form-item label="最低库存" prop="minQuantity">
          <el-input-number v-model="form.minQuantity" :min="0" />
        </el-form-item>
        <el-form-item label="存放位置" prop="location">
          <el-select v-model="form.location" style="width: 100%">
            <el-option label="仓库A" value="仓库A" />
            <el-option label="仓库B" value="仓库B" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 变动记录对话框 -->
    <el-dialog
      v-model="recordDialogVisible"
      title="库存变动记录"
      width="800px">
      <el-table :data="records" style="width: 100%">
        <el-table-column prop="type" label="变动类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === '入库' ? 'success' : 'warning'">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="变动数量" width="100" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="time" label="操作时间" width="180" />
        <el-table-column prop="remarks" label="备注" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单数据
const searchForm = ref({
  name: '',
  model: '',
  location: '',
  status: ''
})

// 统计数据
const statistics = ref({
  total: 0,
  warning: 0,
  inbound: 0,
  outbound: 0
})

// 库存列表数据
const inventoryList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表单相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = ref({
  name: '',
  model: '',
  quantity: 0,
  minQuantity: 0,
  location: '',
  remarks: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
  minQuantity: [{ required: true, message: '请输入最低库存', trigger: 'blur' }],
  location: [{ required: true, message: '请选择存放位置', trigger: 'change' }]
}

// 变动记录相关
const recordDialogVisible = ref(false)
const records = ref([])

// 获取状态标签类型
const getStatusType = (status) => {
  const types = {
    '正常': 'success',
    '低库存': 'warning',
    '缺货': 'danger'
  }
  return types[status] || 'info'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    inventoryList.value = [
      {
        id: 1,
        name: 'DJI Mavic 3',
        model: 'M3P',
        quantity: 10,
        minQuantity: 5,
        location: '仓库A',
        status: '正常',
        lastUpdate: '2024-01-20 10:00:00'
      },
      // 添加更多模拟数据...
    ]
    
    // 更新统计数据
    statistics.value = {
      total: 100,
      warning: 5,
      inbound: 20,
      outbound: 15
    }
    
    total.value = 100
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    name: '',
    model: '',
    location: '',
    status: ''
  }
  handleSearch()
}

// 新增库存
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    model: '',
    quantity: 0,
    minQuantity: 0,
    location: '',
    remarks: ''
  }
  dialogVisible.value = true
}

// 编辑库存
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 查看变动记录
const handleRecord = async (row) => {
  // 模拟加载变动记录
  records.value = [
    {
      type: '入库',
      quantity: 5,
      operator: '张三',
      time: '2024-01-20 10:00:00',
      remarks: '新购入设备'
    },
    // 添加更多记录...
  ]
  recordDialogVisible.value = true
}

// 删除库存
const handleDelete = (row) => {
  if (row.quantity > 0) {
    ElMessage.warning('该设备还有库存，不能删除')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除设备 "${row.name}" 的库存记录吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadData()
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 实现保存逻辑
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.inventory-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.statistics-cards {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  padding: 10px 0;
}

.card-content.warning {
  color: #E6A23C;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>