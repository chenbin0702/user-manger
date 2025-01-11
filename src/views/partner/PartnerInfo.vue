<template>
  <div class="app-container">
    <div class="header-section">
      <h2>合作商信息管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增合作商
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="合作商名称">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入合作商名称" 
            clearable
            class="search-input" 
          />
        </el-form-item>
        <el-form-item label="合作类型">
          <el-select 
            v-model="searchForm.type" 
            placeholder="请选择合作类型" 
            clearable
            class="search-select"
          >
            <el-option label="加盟商" value="franchisee" />
            <el-option label="代理商" value="agent" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select 
            v-model="searchForm.status" 
            placeholder="请选择状态" 
            clearable
            class="search-select"
          >
            <el-option label="正常" value="active" />
            <el-option label="待审核" value="pending" />
            <el-option label="已禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="search-btn">
            <el-icon><Search /></el-icon>查询
          </el-button>
          <el-button @click="resetSearch" class="search-btn">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="合作商名称" min-width="120" />
        <el-table-column prop="type" label="合作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'franchisee' ? 'success' : 'primary'">
              {{ row.type === 'franchisee' ? '加盟商' : '代理商' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expireDate" label="协议到期日" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleViewContract(row)">查看协议</el-button>
            <el-button 
              link 
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="700px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="合作商名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入合作商名称" />
        </el-form-item>
        <el-form-item label="合作类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择合作类型">
            <el-option label="加盟商" value="franchisee" />
            <el-option label="代理商" value="agent" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="formData.contact" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="营业执照">
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-success="handleLicenseSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="primary">上传营业执照</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="代理资质">
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-success="handleQualificationSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="primary">上传资质证明</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="协议到期日" prop="expireDate">
          <el-date-picker
            v-model="formData.expireDate"
            type="date"
            placeholder="选择协议到期日"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 协议查看对话框 -->
    <el-dialog
      title="合作协议详情"
      v-model="contractDialogVisible"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="合作商名称">{{ contractData.name }}</el-descriptions-item>
        <el-descriptions-item label="合作类型">{{ contractData.type === 'franchisee' ? '加盟商' : '代理商' }}</el-descriptions-item>
        <el-descriptions-item label="签约日期">{{ contractData.signDate }}</el-descriptions-item>
        <el-descriptions-item label="到期日期">{{ contractData.expireDate }}</el-descriptions-item>
        <el-descriptions-item label="合作区域" :span="2">{{ contractData.area }}</el-descriptions-item>
        <el-descriptions-item label="业绩目标" :span="2">{{ contractData.target }}</el-descriptions-item>
        <el-descriptions-item label="权益说明" :span="2">{{ contractData.rights }}</el-descriptions-item>
        <el-descriptions-item label="责任说明" :span="2">{{ contractData.obligations }}</el-descriptions-item>
      </el-descriptions>
      <div class="contract-history">
        <h4>变更记录</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(history, index) in contractData.history"
            :key="index"
            :timestamp="history.date"
            :type="history.type"
          >
            {{ history.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '示例合作商',
    type: 'franchisee',
    contact: '张三',
    phone: '13800138000',
    address: '北京市朝阳区xxx街道',
    status: 'active',
    expireDate: '2024-12-31'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const formData = reactive({
  name: '',
  type: '',
  contact: '',
  phone: '',
  address: '',
  expireDate: ''
})

// 协议对话框相关
const contractDialogVisible = ref(false)
const contractData = reactive({
  name: '',
  type: '',
  signDate: '',
  expireDate: '',
  area: '',
  target: '',
  rights: '',
  obligations: '',
  history: []
})

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入合作商名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择合作类型', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  expireDate: [{ required: true, message: '请选择协议到期日', trigger: 'change' }]
}

// 状态标签配置
const getStatusType = (status) => {
  const map = {
    active: 'success',
    pending: 'warning',
    disabled: 'danger'
  }
  return map[status]
}

const getStatusText = (status) => {
  const map = {
    active: '正常',
    pending: '待审核',
    disabled: '已禁用'
  }
  return map[status]
}

// 方法定义
const handleSearch = () => {
  // 实现搜索逻辑
  ElMessage.success('执行搜索')
}

const resetSearch = () => {
  // 重置搜索表单
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
}

const handleAdd = () => {
  dialogTitle.value = '新增合作商'
  dialogVisible.value = true
  // 重置表单数据
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑合作商'
  dialogVisible.value = true
  // 填充表单数据
  Object.keys(formData).forEach(key => {
    formData[key] = row[key]
  })
}

const handleViewContract = (row) => {
  // 查看协议详情
  contractDialogVisible.value = true
  // 模拟数据
  Object.assign(contractData, {
    name: row.name,
    type: row.type,
    signDate: '2023-01-01',
    expireDate: row.expireDate,
    area: '北京市朝阳区',
    target: '年度销售额不低于100万',
    rights: '享有区域独家代理权，平台技术支持等',
    obligations: '遵守平台规则，完成销售指标，保证服务质量',
    history: [
      { date: '2023-01-01', type: 'success', content: '签订初始协议' },
      { date: '2023-06-01', type: 'warning', content: '变更业绩目标条款' }
    ]
  })
}

const handleToggleStatus = (row) => {
  // 切换状态
  ElMessage.success(`${row.status === 'active' ? '禁用' : '启用'}成功`)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // 提交表单
      ElMessage.success('保存成功')
      dialogVisible.value = false
    }
  })
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}

const beforeUpload = (file) => {
  // 文件上传前的验证
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上传文件大小不能超过 2MB!')
  }
  return isLt2M
}

const handleLicenseSuccess = (response) => {
  // 处理营业执照上传成功
  ElMessage.success('营业执照上传成功')
}

const handleQualificationSuccess = (response) => {
  // 处理资质证明上传成功
  ElMessage.success('资质证明上传成功')
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-card {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.search-form {
  padding: 16px;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 24px;
}

.search-form :deep(.el-form-item__label) {
  font-weight: normal;
  color: #606266;
}

.search-input {
  width: 220px;
}

.search-select {
  width: 180px;
}

.search-btn {
  margin-left: 8px;
  padding: 8px 16px;
}

.search-btn .el-icon {
  margin-right: 4px;
  font-size: 14px;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #fff;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  padding: 1px 11px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.contract-history {
  margin-top: 20px;
}

.upload-demo {
  margin-top: 8px;
}

:deep(.el-descriptions) {
  margin-bottom: 20px;
}

:deep(.el-timeline) {
  margin-top: 10px;
  padding-left: 20px;
}
</style> 