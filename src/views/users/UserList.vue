<template>
  <div class="user-list">
    <div class="header">
      <h2>用户列表</h2>
      <div class="actions">
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户"
            class="search-input"
            clearable
            @clear="handleSearch">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
      </div>
    </div>

    <el-table :data="filteredUsers" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <status-tag :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
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

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <user-form
      v-model:visible="formVisible"
      :is-edit="isEdit"
      :user-data="currentUser"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StatusTag from '@/components/common/StatusTag.vue'
import UserForm from '@/components/users/UserForm.vue'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const formVisible = ref(false)
const isEdit = ref(false)
const currentUser = ref({})

// Mock data - replace with actual API calls
const users = ref([
  {
    id: 1,
    username: 'admin',
    name: '张三',
    email: 'admin@example.com',
    role: '管理员',
    status: '启用'
  },
  {
    id: 2,
    username: 'user1',
    name: '李四',
    email: 'user1@example.com',
    role: '普通用户',
    status: '启用'
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.username.includes(searchQuery.value) ||
    user.name.includes(searchQuery.value) ||
    user.email.includes(searchQuery.value)
  )
})

const handleSearch = () => {
  // Implement search logic
  currentPage.value = 1
}

const handleAdd = () => {
  isEdit.value = false
  currentUser.value = {}
  formVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  currentUser.value = { ...row }
  formVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除用户 ${row.username} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // Implement delete logic
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  })
}

const handleFormSubmit = (formData) => {
  // Implement save/update logic
  console.log('Form submitted:', formData)
  ElMessage({
    type: 'success',
    message: isEdit.value ? '更新成功' : '创建成功'
  })
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // Implement pagination logic
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // Implement pagination logic
}
</script>

<style scoped>
.user-list {
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
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
  width: 300px;
}
</style>