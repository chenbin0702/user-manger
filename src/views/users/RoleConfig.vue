<template>
  <div class="role-config">
    <div class="header">
      <h2>角色配置</h2>
      <el-button type="primary" @click="handleAddRole">新建角色</el-button>
    </div>

    <el-table :data="roles" style="width: 100%">
      <el-table-column prop="id" label="角色ID" width="100" />
      <el-table-column prop="name" label="角色名称" width="150" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button size="small" @click="handleEditRole(row)">编辑</el-button>
          <el-button 
            size="small" 
            type="success" 
            @click="handleConfigPermissions(row)">
            配置权限
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDeleteRole(row)"
            :disabled="row.id === 1">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 角色表单 -->
    <role-form
      v-model:visible="roleFormVisible"
      :is-edit="isEdit"
      :role-data="currentRole"
      @submit="handleRoleSubmit"
    />

    <!-- 权限配置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="配置权限"
      width="600px">
      <div v-if="currentRole.id">
        <h3 class="permission-title">{{ currentRole.name }} - 权限配置</h3>
        <permission-tree
          :permissions="permissions"
          v-model:checkedKeys="checkedPermissions"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePermissions">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import RoleForm from '@/components/role/RoleForm.vue'
import PermissionTree from '@/components/role/PermissionTree.vue'
import { roleService } from '@/services/roleService'

const roles = ref([])
const permissions = ref([
  {
    id: 1,
    name: '用户管理',
    children: [
      { id: 11, name: '查看用户列表' },
      { id: 12, name: '新增用户' },
      { id: 13, name: '编辑用户' },
      { id: 14, name: '删除用户' }
    ]
  },
  {
    id: 2,
    name: '角色管理',
    children: [
      { id: 21, name: '查看角色' },
      { id: 22, name: '新增角色' },
      { id: 23, name: '编辑角色' },
      { id: 24, name: '删除角色' }
    ]
  }
])

const roleFormVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const currentRole = ref({})
const checkedPermissions = ref([])

onMounted(async () => {
  try {
    roles.value = await roleService.getRoles()
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  }
})

const handleAddRole = () => {
  isEdit.value = false
  currentRole.value = {}
  roleFormVisible.value = true
}

const handleEditRole = (row) => {
  isEdit.value = true
  currentRole.value = { ...row }
  roleFormVisible.value = true
}

const handleRoleSubmit = async (formData) => {
  // 实现保存逻辑
  ElMessage.success(isEdit.value ? '角色更新成功' : '角色创建成功')
  // 重新加载角色列表
  roles.value = await roleService.getRoles()
}

const handleConfigPermissions = async (row) => {
  currentRole.value = row
  try {
    checkedPermissions.value = await roleService.getRolePermissions(row.id)
    permissionDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取角色权限失败')
  }
}

const handleSavePermissions = async () => {
  try {
    await roleService.saveRolePermissions(
      currentRole.value.id,
      checkedPermissions.value
    )
    ElMessage.success('权限配置保存成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存权限配置失败')
  }
}

const handleDeleteRole = (row) => {
  if (row.id === 1) {
    ElMessage.warning('超级管理员角色不能删除')
    return
  }

  ElMessageBox.confirm(
    `确定要删除角色 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
    // 重新加载角色列表
    roles.value = await roleService.getRoles()
  })
}
</script>

<style scoped>
.role-config {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.permission-title {
  margin-bottom: 20px;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>