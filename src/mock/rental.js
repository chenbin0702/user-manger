// 租赁订单数据
export const mockOrders = [
  {
    id: 1,
    orderNo: 'R202312001',
    equipmentName: 'DJI Mavic 3',
    customerName: '张三',
    startDate: '2023-12-20',
    endDate: '2023-12-25',
    deposit: 2000,
    rentalFee: 1495,
    status: '进行中',
    createTime: '2023-12-20 10:00:00'
  },
  {
    id: 2,
    orderNo: 'R202312002',
    equipmentName: 'DJI Mini 3',
    customerName: '李四',
    startDate: '2023-12-21',
    endDate: '2023-12-23',
    deposit: 1000,
    rentalFee: 598,
    status: '待支付',
    createTime: '2023-12-20 14:30:00'
  }
]

// 租赁规则数据
export const mockRules = [
  {
    id: 1,
    categoryId: 11,
    categoryName: '多旋翼无人机',
    minDuration: 1,
    maxDuration: 30,
    depositAmount: 2000,
    dailyRate: 299,
    overdueFee: 598,
    damagePolicy: '设备损坏需赔偿维修费用',
    isActive: true
  },
  {
    id: 2,
    categoryId: 12,
    categoryName: '固定翼无人机',
    minDuration: 2,
    maxDuration: 15,
    depositAmount: 3000,
    dailyRate: 499,
    overdueFee: 998,
    damagePolicy: '设备损坏需赔偿维修费用',
    isActive: true
  }
]

// 押金记录数据
export const mockDeposits = [
  {
    id: 1,
    orderNo: 'R202312001',
    customerName: '张三',
    amount: 2000,
    type: '收取',
    status: '待退还',
    time: '2023-12-20 10:00:00',
    remarks: '租赁押金'
  },
  {
    id: 2,
    orderNo: 'R202312002',
    customerName: '李四',
    amount: 1000,
    type: '收取',
    status: '已退还',
    time: '2023-12-21 14:30:00',
    remarks: '租赁押金'
  }
]