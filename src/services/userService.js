import { mockUsers } from '../mock/users'

// 用户相关的 API 服务
export const userService = {
  // 获取用户列表
  getUsers(params) {
    const { page = 1, pageSize = 10, keyword = '' } = params || {}
    let list = [...mockUsers]
    
    // 搜索过滤
    if (keyword) {
      list = list.filter(item => 
        item.username.includes(keyword) || 
        item.name.includes(keyword) || 
        item.email.includes(keyword)
      )
    }

    // 分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return Promise.resolve({
      total: list.length,
      list: list.slice(start, end)
    })
  },

  // 创建用户
  createUser(userData) {
    console.log('Creating user:', userData)
    return Promise.resolve({ success: true })
  },

  // 更新用户
  updateUser(id, userData) {
    console.log('Updating user:', { id, userData })
    return Promise.resolve({ success: true })
  },

  // 删除用户
  deleteUser(id) {
    console.log('Deleting user:', id)
    return Promise.resolve({ success: true })
  }
}