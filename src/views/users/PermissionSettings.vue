<template>
  <div class="permission-settings">
    <div class="header">
      <h2>权限设置</h2>
    </div>

    <el-card class="permission-card">
      <template #header>
        <div class="card-header">
          <span>选择角色</span>
        </div>
      </template>
      <el-select v-model="selectedRole" placeholder="请选择角色" style="width: 100%">
        <el-option
          v-for="role in roles"
          :key="role.id"
          :label="role.name"
          :value="role.id"
        />
      </el-select>
    </el-card>

    <el-card class="permission-card" v-if="selectedRole">
      <template #header>
        <div class="card-header">
          <span>权限配置</span>
          <el-button type="primary" @click="handleSavePermissions">
            保存设置
          </el-button>
        </div>
      </template>
      
      <el-tree
        ref="permissionTree"
        :data="permissions"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedPermissions"
        :props="{
          children: 'children',
          label: 'name'
        }"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const selectedRole = ref(null)
const permissionTree = ref(null)

const roles = ref([
  { id: 1, name: '超级管理员' },
  { id: 2, name: '普通用户' }
])

const permissions = ref([
  {
    id: 1,
    name: '用户管理',
    children: [
      {
        id: 11,
        name: '查看用户列表'
      },
      {
        id: 12,
        name: '新增用户'
      },
      {
        id: 13,
        name: '编辑用户'
      },
      {
        id: 14,
        name: '删除用户'
      }
    ]
  },
  {
    id: 2,
    name: '角色管理',
    children: [
      {
        id: 21,
        name: '查看角色'
      },
      {
        id: 22,
        name: '新增角色'
      },
      {
        id: 23,
        name: '编辑角色'
      },
      {
        id: 24,
        name: '删除角色'
      }
    ]
  }
])

const checkedPermissions = ref([])

watch(selectedRole, (newRole) => {
  if (newRole) {
    // Mock API call to get role permissions
    // Replace with actual API call
    checkedPermissions.value = newRole === 1 
      ? [11, 12, 13, 14, 21, 22, 23, 24] 
      : [11, 21]
  }
})

const handleSavePermissions = () => {
  const checkedNodes = permissionTree.value.getCheckedKeys()
  const halfCheckedNodes = permissionTree.value.getHalfCheckedKeys()
  
  console.log('Saving permissions:', {
    roleId: selectedRole.value,
    permissions: [...checkedNodes, ...halfCheckedNodes]
  })
  
  ElMessage({
    type: 'success',
    message: '权限设置保存成功'
  })
}
</script>

<style scoped>
.permission-settings {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.permission-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>