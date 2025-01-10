// Mock data for demonstration
const mockOrders = [
  {
    id: 1,
    orderNo: 'ORD202312001',
    type: '设备租赁',
    customerName: '张三',
    customerPhone: '13800138000',
    amount: 1999.00,
    status: '进行中',
    createTime: '2023-12-20 10:00:00',
    updateTime: '2023-12-20 10:00:00',
    remarks: '租赁无人机一台'
  },
  {
    id: 2,
    orderNo: 'ORD202312002',
    type: '培训课程',
    customerName: '李四',
    customerPhone: '13900139000',
    amount: 3999.00,
    status: '待付款',
    createTime: '2023-12-20 11:30:00',
    updateTime: '2023-12-20 11:30:00',
    remarks: '无人机驾驶培训课程'
  },
  {
    id: 3,
    orderNo: 'ORD202312003',
    type: '设备维修',
    customerName: '王五',
    customerPhone: '13700137000',
    amount: 599.00,
    status: '已完成',
    createTime: '2023-12-19 15:20:00',
    updateTime: '2023-12-20 09:30:00',
    remarks: '无人机螺旋桨维修'
  }
]

export const orderService = {
  // Get orders with filtering and pagination
  getOrders({ page = 1, pageSize = 10, status = '', keyword = '' }) {
    let filteredOrders = [...mockOrders]
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }
    
    if (keyword) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderNo.includes(keyword) ||
        order.customerName.includes(keyword)
      )
    }
    
    return Promise.resolve({
      orders: filteredOrders.slice((page - 1) * pageSize, page * pageSize),
      total: filteredOrders.length
    })
  },

  // Get order statistics
  getStatistics() {
    return Promise.resolve({
      totalOrders: mockOrders.length,
      totalAmount: mockOrders.reduce((sum, order) => sum + order.amount, 0),
      completed: mockOrders.filter(order => order.status === '已完成').length,
      typeDistribution: [
        { type: '设备租赁', value: 40 },
        { type: '培训课程', value: 30 },
        { type: '保险服务', value: 20 },
        { type: '其他', value: 10 }
      ]
    })
  },

  // Get order counts by status
  getOrderCounts() {
    return Promise.resolve({
      all: mockOrders.length,
      pending: mockOrders.filter(order => order.status === '待付款').length,
      processing: mockOrders.filter(order => order.status === '进行中').length,
      completed: mockOrders.filter(order => order.status === '已完成').length,
      cancelled: mockOrders.filter(order => order.status === '已取消').length
    })
  },

  // Delete order
  deleteOrder(orderId) {
    console.log('Deleting order:', orderId)
    return Promise.resolve({ success: true })
  }
}