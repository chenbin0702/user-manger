<template>
  <div class="certificate-management">
    <div class="header">
      <h2>证书管理</h2>
      <div class="actions">
        <div class="search-bar">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索证书名称/编号"
            clearable
            @clear="handleSearch"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select 
            v-model="searchForm.status" 
            placeholder="证书状态"
            clearable
            class="search-select"
          >
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">新增证书类型</el-button>
      </div>
    </div>

    <el-table 
      :data="certificateList" 
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="证书名称"  />
      <!-- <el-table-column prop="effectiveDate" label="生效日期" width="180">
        <template #default="{ row }">
          {{ formatDate(row.effectiveDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="expiryDate" label="失效日期" width="180">
        <template #default="{ row }">
          {{ formatDate(row.expiryDate) }}
        </template>
      </el-table-column> -->
      <el-table-column prop="issuingAuthority" label="发证机构"  />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <status-tag :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row)">
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

    <!-- 证书表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑证书' : '新增证书'"
      width="500px">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="证书名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="form.effectiveDate"
            type="date"
            placeholder="选择生效日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disablePastDates"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="失效日期" prop="expiryDate">
          <el-date-picker
            v-model="form.expiryDate"
            type="date"
            placeholder="选择失效日期"
            value-format="YYYY-MM-DD"
            :disabled-date="(time) => disablePastDates(time) || disableBeforeEffectiveDate(time)"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="发证机构" prop="issuingAuthority">
          <el-input v-model="form.issuingAuthority" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { authService } from '@/services/authService'

const certificateList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const form = ref({
  name: '',
  effectiveDate: '',
  expiryDate: '',
  issuingAuthority: '',
  status: '启用'
})

const rules = {
  name: [
    { required: true, message: '请输入证书名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  effectiveDate: [
    { required: true, message: '请选择生效日期', trigger: 'change' }
  ],
  expiryDate: [
    { required: true, message: '请选择失效日期', trigger: 'change' }
  ],
  issuingAuthority: [
    { required: true, message: '请输入发证机构', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 日期格式化
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 禁用过去的日期
const disablePastDates = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 8.64e7 是一天的毫秒数
}

// 禁用早于生效日期的日期
const disableBeforeEffectiveDate = (time) => {
  if (!form.value.effectiveDate) return false
  const effectiveDate = new Date(form.value.effectiveDate)
  return time.getTime() < effectiveDate.getTime()
}

// 搜索表单
const searchForm = ref({
  keyword: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

onMounted(async () => {
  try {
    certificateList.value = await authService.getCertificates()
  } catch (error) {
    ElMessage.error('获取证书列表失败')
  }
})

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    effectiveDate: '',
    expiryDate: '',
    issuingAuthority: '',
    status: '启用'
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 实现保存逻辑
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      // 重新加载列表
      loadData()
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除证书 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
    // 重新加载列表
    loadData()
  })
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    status: ''
  }
  handleSearch()
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

const loadData = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await authService.getCertificates({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    certificateList.value = list
    total.value = totalCount
  } catch (error) {
    ElMessage.error('获取证书列表失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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

.search-select {
  width: 160px;
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