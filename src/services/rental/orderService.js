import { mockOrders } from '@/mock/rental'

export const orderService = {
  // Get rental orders with filtering and pagination
  getOrders(params = {}) {
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

  // Process rental order (return/complete)
  processOrder(orderId, action, data) {
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
      return Promise.reject(new Error('Order not found'))
    }

    switch (action) {
      case 'return':
        order.status = '已完成'
        break
      case 'cancel':
        order.status = '已取消'
        break
      default:
        return Promise.reject(new Error('Invalid action'))
    }

    return Promise.resolve({ success: true })
  }
}