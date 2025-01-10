<template>
  <div class="ad-list">
    <div class="header">
      <h2>广告内容管理</h2>
      <div class="actions">
        <div class="search-bar">
          <el-select v-model="searchForm.position" placeholder="广告位" clearable class="position-select">
            <el-option
              v-for="item in positions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-select v-model="searchForm.status" placeholder="状态" clearable>
            <el-option label="投放中" value="active" />
            <el-option label="已暂停" value="paused" />
            <el-option label="已结束" value="ended" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增广告
        </el-button>
      </div>
    </div>

    <!-- 广告列表 -->
    <el-table :data="advertisements" style="width: 100%">
      <el-table-column prop="title" label="广告标题" min-width="150" show-overflow-tooltip />
      <el-table-column prop="positionName" label="广告位" width="150" />
      <el-table-column label="广告内容" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.type === 'image'"
            :src="row.content"
            :preview-src-list="[row.content]"
            fit="cover"
            class="ad-image"
          />
          <span v-else>{{ row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="clickCount" label="点击量" width="100" sortable />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            size="small" 
            :type="row.status === '投放中' ? 'warning' : 'success'"
            @click="handleToggleStatus(row)">
            {{ row.status === '投放中' ? '暂停' : '启用' }}
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

    <!-- 广告表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑广告' : '新增广告'"
      width="600px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入广告标题" />
        </el-form-item>
        <el-form-item label="广告位" prop="positionId">
          <el-select v-model="form.positionId" placeholder="请选择广告位" style="width: 100%">
            <el-option
              v-for="item in positions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="投放时间" prop="timeRange">
          <el-date-picker
            v-model="form.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="广告内容" prop="content">
          <el-upload
            v-if="selectedPosition?.type === 'image'"
            class="content-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <img v-if="form.content" :src="form.content" class="content-image" />
            <el-icon v-else class="content-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-input
            v-else
            v-model="form.content"
            type="textarea"
            :rows="3"
            placeholder="请输入广告内容" />
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="'投放中'"
            :inactive-value="'已暂停'"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = ref({
  position: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 广告位数据
const positions = ref([
  { id: 1, name: '首页顶部横幅', type: 'image' },
  { id: 2, name: '侧边栏广告', type: 'image' }
])

// 广告数据
const advertisements = ref([
  {
    id: 1,
    title: '新年促销活动',
    positionName: '首页顶部横幅',
    type: 'image',
    content: 'https://example.com/ad1.jpg',
    startTime: '2024-01-20 00:00:00',
    endTime: '2024-02-20 23:59:59',
    status: '投放中',
    clickCount: 1256
  },
  {
    id: 2,
    title: '限时优惠',
    positionName: '侧边栏广告',
    type: 'image',
    content: 'https://example.com/ad2.jpg',
    startTime: '2024-01-25 00:00:00',
    endTime: '2024-02-25 23:59:59',
    status: '已暂停',
    clickCount: 856
  }
])

// 表单相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = ref({
  title: '',
  positionId: '',
  timeRange: [],
  content: '',
  url: '',
  status: '投放中'
})

// 选中的广告位
const selectedPosition = computed(() => {
  return positions.value.find(p => p.id === form.value.positionId)
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入广告标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  positionId: [
    { required: true, message: '请选择广告位', trigger: 'change' }
  ],
  timeRange: [
    { required: true, message: '请选择投放时间', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请上传广告内容', trigger: 'change' }
  ],
  url: [
    { required: true, message: '请输入链接地址', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL地址', trigger: 'blur' }
  ]
}

// 获取状态样式
const getStatusType = (status) => {
  const types = {
    '投放中': 'success',
    '已暂停': 'warning',
    '已结束': 'info'
  }
  return types[status] || 'info'
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 新增广告
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    title: '',
    positionId: '',
    timeRange: [],
    content: '',
    url: '',
    status: '投放中'
  }
  dialogVisible.value = true
}

// 编辑广告
const handleEdit = (row) => {
  isEdit.value = true
  form.value = {
    ...row,
    timeRange: [new Date(row.startTime), new Date(row.endTime)]
  }
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = (row) => {
  const action = row.status === '投放中' ? '暂停' : '启用'
  ElMessageBox.confirm(
    `确定要${action}广告 "${row.title}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现状态切换逻辑
    ElMessage.success(`${action}成功`)
    loadData()
  })
}

// 删除广告
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除广告 "${row.title}" 吗？`,
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

// 上传相关
const handleUploadSuccess = (response) => {
  form.value.content = response.url
}

const beforeUpload = (file) => {
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
.ad-list {
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

.position-select {
  width: 160px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.ad-image {
  width: 80px;
  height: 60px;
  border-radius: 4px;
}

.content-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.content-uploader:hover {
  border-color: #409EFF;
}

.content-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.content-image {
  width: 178px;
  height: 178px;
  display: block;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>