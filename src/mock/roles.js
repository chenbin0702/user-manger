// 角色相关的模拟数据
export const mockRoles = [
  {
    id: 1,
    name: '超级管理员',
    description: '系统最高权限角色',
    createTime: '2023-07-20 10:00:00',
    permissions: [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33]
  },
  {
    id: 2,
    name: '运营管理员',
    description: '负责日常运营管理',
    createTime: '2023-07-21 11:00:00',
    permissions: [11, 12, 21, 31]
  },
  {
    id: 3,
    name: '飞手',
    description: '执飞任务人员',
    createTime: '2023-07-22 14:00:00',
    permissions: [11, 31]
  }
]

export const mockPermissions = [
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
  },
  {
    id: 3,
    name: '认证管理',
    children: [
      { id: 31, name: '查看认证信息' },
      { id: 32, name: '审核认证' },
      { id: 33, name: '管理证书' }
    ]
  }
]