<template>
  <div class="ad-positions">
    <div class="header">
      <h2>广告位管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增广告位
      </el-button>
    </div>

    <!-- 广告位列表 -->
    <el-table :data="positions" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="广告位名称" width="150" />
      <el-table-column prop="code" label="广告位编码" width="150" />
      <el-table-column prop="type" label="广告类型" width="120">
        <template #default="{ row }">
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="尺寸" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            size="small" 
            :type="row.status === '启用' ? 'warning' : 'success'"
            @click="handleToggleStatus(row)">
            {{ row.status === '启用' ? '禁用' : '启用' }}
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

    <!-- 广告位表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑广告位' : '新增广告位'"
      width="500px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="广告位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入广告位名称" />
        </el-form-item>
        <el-form-item label="广告位编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入广告位编码" />
        </el-form-item>
        <el-form-item label="广告类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择广告类型" style="width: 100%">
            <el-option label="图片广告" value="image" />
            <el-option label="视频广告" value="video" />
            <el-option label="文字广告" value="text" />
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸" prop="size">
          <el-input v-model="form.size" placeholder="例如：1920x1080" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="'启用'"
            :inactive-value="'禁用'"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入广告位描述" />
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
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 广告位数据
const positions = ref([
  {
    id: 1,
    name: '首页顶部横幅',
    code: 'home_top_banner',
    type: '图片广告',
    size: '1920x400',
    status: '启用',
    description: '首页顶部大图展示位置',
    createTime: '2024-01-20 10:00:00'
  },
  {
    id: 2,
    name: '侧边栏广告',
    code: 'sidebar_ad',
    type: '图片广告',
    size: '300x250',
    status: '启用',
    description: '侧边栏广告位',
    createTime: '2024-01-20 11:30:00'
  }
])

// 表单相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = ref({
  name: '',
  code: '',
  type: '',
  size: '',
  status: '启用',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入广告位名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入广告位编码', trigger: 'blur' },
    { pattern: /^[a-z][a-z0-9_]*$/, message: '编码只能包含小写字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择广告类型', trigger: 'change' }
  ],
  size: [
    { required: true, message: '请输入广告位尺寸', trigger: 'blur' },
    { pattern: /^\d+x\d+$/, message: '尺寸格式不正确，例如：1920x1080', trigger: 'blur' }
  ]
}

// 新增广告位
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    code: '',
    type: '',
    size: '',
    status: '启用',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑广告位
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = (row) => {
  const action = row.status === '启用' ? '禁用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}广告位 "${row.name}" 吗？`,
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

// 删除广告位
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除广告位 "${row.name}" 吗？`,
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

// 加载数据
const loadData = () => {
  // 实现数据加载逻辑
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.ad-positions {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>