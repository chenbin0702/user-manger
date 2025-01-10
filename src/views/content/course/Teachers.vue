<template>
  <div class="teacher-management">
    <div class="header">
      <h2>讲师管理</h2>
      <div class="actions">
        <div class="search-bar">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索讲师姓名/专业领域"
            clearable
            class="search-input">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="searchForm.status" placeholder="资质状态" clearable>
            <el-option label="待审核" value="待审核" />
            <el-option label="已认证" value="已认证" />
            <el-option label="未通过" value="未通过" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增讲师
        </el-button>
      </div>
    </div>

    <!-- 讲师列表 -->
    <el-table :data="teachers" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="phone" label="联系方式" width="120" />
      <el-table-column prop="field" label="专业领域" width="150" />
      <el-table-column prop="courseCount" label="课程数" width="100" />
      <el-table-column prop="studentCount" label="学员数" width="100" />
      <el-table-column prop="rating" label="评分" width="180">
        <template #default="{ row }">
          <el-rate
            v-model="row.rating"
            disabled
            show-score
            text-color="#ff9900"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="资质状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            size="small" 
            type="primary"
            @click="handleReview(row)"
            v-if="row.status === '待审核'">
            审核
          </el-button>
          <el-button 
            size="small" 
            type="success"
            @click="handleViewEvaluations(row)">
            评价
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row)"
            :disabled="row.courseCount > 0">
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

    <!-- 讲师表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑讲师' : '新增讲师'"
      width="600px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="专业领域" prop="field">
          <el-select v-model="form.field" style="width: 100%">
            <el-option label="无人机驾驶" value="无人机驾驶" />
            <el-option label="无人机维修" value="无人机维修" />
            <el-option label="航拍技术" value="航拍技术" />
          </el-select>
        </el-form-item>
        <el-form-item label="教学经验" prop="experience">
          <el-input-number 
            v-model="form.experience" 
            :min="0"
            :max="50"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="资质证书" prop="certificates">
          <el-upload
            class="certificate-uploader"
            action="/api/upload"
            :file-list="form.certificates"
            :on-success="handleCertificateSuccess"
            :before-upload="beforeCertificateUpload">
            <el-button type="primary">上传证书</el-button>
            <template #tip>
              <div class="el-upload__tip">
                只能上传jpg/png文件，且不超过2MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人简介" prop="introduction">
          <el-input
            v-model="form.introduction"
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

    <!-- 资质审核对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      title="资质审核"
      width="500px">
      <el-form
        ref="reviewFormRef"
        :model="reviewForm"
        :rules="reviewRules"
        label-width="100px">
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="reviewForm.status">
            <el-radio label="已认证">通过</el-radio>
            <el-radio label="未通过">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="remarks">
          <el-input
            v-model="reviewForm.remarks"
            type="textarea"
            :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleReviewSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = ref({
  keyword: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 讲师数据
const teachers = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    field: '无人机驾驶',
    courseCount: 5,
    studentCount: 156,
    rating: 4.8,
    status: '已认证'
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    field: '航拍技术',
    courseCount: 3,
    studentCount: 89,
    rating: 4.6,
    status: '待审核'
  }
])

// 表单相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = ref({
  name: '',
  phone: '',
  field: '',
  experience: 0,
  certificates: [],
  introduction: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入讲师姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  field: [{ required: true, message: '请选择专业领域', trigger: 'change' }],
  experience: [{ required: true, message: '请输入教学经验', trigger: 'blur' }],
  certificates: [{ required: true, message: '请上传资质证书', trigger: 'change' }],
  introduction: [{ required: true, message: '请输入个人简介', trigger: 'blur' }]
}

// 审核相关
const reviewDialogVisible = ref(false)
const reviewFormRef = ref(null)
const reviewForm = ref({
  status: '',
  remarks: ''
})

const reviewRules = {
  status: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
  remarks: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
}

// 获取状态样式
const getStatusType = (status) => {
  const types = {
    '待审核': 'warning',
    '已认证': 'success',
    '未通过': 'danger'
  }
  return types[status] || 'info'
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 新增讲师
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    phone: '',
    field: '',
    experience: 0,
    certificates: [],
    introduction: ''
  }
  dialogVisible.value = true
}

// 编辑讲师
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 删除讲师
const handleDelete = (row) => {
  if (row.courseCount > 0) {
    ElMessage.warning('该讲师还有在教课程，不能删除')
    return
  }

  ElMessageBox.confirm(
    `确定要删除讲师 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
    loadData()
  })
}

// 资质审核
const handleReview = (row) => {
  reviewForm.value = {
    status: '',
    remarks: ''
  }
  reviewDialogVisible.value = true
}

// 提交审核
const handleReviewSubmit = async () => {
  if (!reviewFormRef.value) return
  
  await reviewFormRef.value.validate((valid) => {
    if (valid) {
      // 实现审核逻辑
      ElMessage.success('审核完成')
      reviewDialogVisible.value = false
      loadData()
    }
  })
}

// 查看评价
const handleViewEvaluations = (row) => {
  // 实现查看评价逻辑
}

// 证书上传相关
const handleCertificateSuccess = (response, file) => {
  form.value.certificates.push({
    name: file.name,
    url: response.url
  })
}

const beforeCertificateUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }

  return isImage && isLt2M
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

// 加载数据
const loadData = () => {
  // 实现数据加载逻辑
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.teacher-management {
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

.search-input {
  width: 200px;
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

.certificate-uploader {
  width: 100%;
}

.el-upload__tip {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}
</style>