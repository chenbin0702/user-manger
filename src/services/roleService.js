import { mockRoles, mockPermissions } from '../mock/roles'

// 角色相关的 API 服务
export const roleService = {
  // 获取角色列表
  getRoles() {
    return Promise.resolve(mockRoles)
  },

  // 获取所有权限
  getPermissions() {
    return Promise.resolve(mockPermissions)
  },

  // 获取角色权限
  getRolePermissions(roleId) {
    const role = mockRoles.find(r => r.id === roleId)
    return Promise.resolve(role ? role.permissions : [])
  },

  // 保存角色权限
  saveRolePermissions(roleId, permissions) {
    console.log('Saving permissions:', { roleId, permissions })
    return Promise.resolve(true)
  }
}