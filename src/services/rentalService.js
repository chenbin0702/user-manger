import { mockOrders, mockRules, mockDeposits } from '../mock/rental'

export const rentalService = {
  // 获取租赁订单列表
  getRentalOrders(params = {}) {
    const { page = 1, pageSize = 10, status = '', keyword = '' } = params
    let list = [...mockOrders]
    
    if (status) {
      list = list.filter(order => order.status === status)
    }
    
    if (keyword) {
      list = list.filter(order => 
        order.orderNo.includes(keyword) ||
        order.customerName.includes(keyword) ||
        order.equipmentName.includes(keyword)
      )
    }
    
    return Promise.resolve({
      total: list.length,
      list: list.slice((page - 1) * pageSize, page * pageSize)
    })
  },

  // 获取租赁规则列表
  getRentalRules(params = {}) {
    const { categoryId = '' } = params
    let list = [...mockRules]
    
    if (categoryId) {
      list = list.filter(rule => rule.categoryId === categoryId)
    }
    
    return Promise.resolve(list)
  },

  // 更新租赁规则
  updateRentalRule(id, data) {
    const index = mockRules.findIndex(rule => rule.id === id)
    if (index > -1) {
      mockRules[index] = { ...mockRules[index], ...data }
      return Promise.resolve(mockRules[index])
    }
    return Promise.reject(new Error('Rule not found'))
  },

  // 获取押金记录列表
  getDepositRecords(params = {}) {
    const { page = 1, pageSize = 10, status = '' } = params
    let list = [...mockDeposits]
    
    if (status) {
      list = list.filter(deposit => deposit.status === status)
    }
    
    return Promise.resolve({
      total: list.length,
      list: list.slice((page - 1) * pageSize, page * pageSize)
    })
  },

  // 获取押金统计数据
  getDepositStatistics() {
    return Promise.resolve({
      totalDeposit: mockDeposits.reduce((sum, item) => sum + item.amount, 0),
      pendingDeposit: mockDeposits
        .filter(item => item.status === '待退还')
        .reduce((sum, item) => sum + item.amount, 0),
      monthlyRefund: mockDeposits
        .filter(item => item.status === '已退还')
        .reduce((sum, item) => sum + item.amount, 0)
    })
  }
}