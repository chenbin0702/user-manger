import { mockCategories, mockEquipments, mockInventory } from '../mock/equipment'

export const equipmentService = {
  // 获取设备分类列表
  getCategories() {
    return Promise.resolve(mockCategories)
  },

  // 创建分类
  createCategory(categoryData) {
    console.log('Creating category:', categoryData)
    return Promise.resolve({ success: true })
  },

  // 更新分类
  updateCategory(id, categoryData) {
    console.log('Updating category:', { id, categoryData })
    return Promise.resolve({ success: true })
  },

  // 删除分类
  deleteCategory(id) {
    console.log('Deleting category:', id)
    return Promise.resolve({ success: true })
  },

  // 获取设备列表
  getEquipments(params) {
    const { page = 1, pageSize = 10, keyword = '', categoryId = '' } = params
    let list = [...mockEquipments]
    
    if (keyword) {
      list = list.filter(item => 
        item.name.includes(keyword) || 
        item.code.includes(keyword)
      )
    }
    
    if (categoryId) {
      list = list.filter(item => item.categoryId === categoryId)
    }
    
    return Promise.resolve({
      total: list.length,
      list: list.slice((page - 1) * pageSize, page * pageSize)
    })
  }
}