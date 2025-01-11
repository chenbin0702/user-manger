// 设备分类数据
export const mockCategories = [
  {
    id: 1,
    name: '无人机',
    sort: 0,
    description: '各类无人机设备',
    children: [
      { 
        id: 11, 
        name: '多旋翼无人机',
        sort: 0,
        description: '多个旋翼的无人机'
      },
      { 
        id: 12, 
        name: '固定翼无人机',
        sort: 1,
        description: '固定翼结构的无人机'
      }
    ]
  },
  {
    id: 2,
    name: '配件',
    sort: 1,
    description: '无人机相关配件',
    children: [
      { 
        id: 21, 
        name: '电池',
        sort: 0,
        description: '各类无人机电池'
      },
      { 
        id: 22, 
        name: '螺旋桨',
        sort: 1,
        description: '各类无人机螺旋桨'
      },
      { 
        id: 23, 
        name: '相机云台',
        sort: 2,
        description: '相机稳定器和云台'
      }
    ]
  }
]

// Rest of the mock data remains unchanged
export const mockEquipments = [
  {
    id: 1,
    code: 'UAV001',
    name: 'DJI Mavic 3',
    categoryId: 11, 
    categoryName: '多旋翼无人机',
    specifications: '最大起飞重量：895g，最大飞行时间：46分钟',
    price: 12999,
    rentPrice: 299,
    status: '在库'
  },
  {
    id: 2,
    code: 'BAT001',
    name: 'Mavic 3 智能飞行电池',
    categoryId: 21,
    categoryName: '电池',
    specifications: '容量：5000mAh，电压：15.4V',
    price: 999,
    rentPrice: 49,
    status: '在库'
  }
]

export const mockInventory = [
  {
    equipmentId: 1,
    totalQuantity: 10,
    availableQuantity: 8,
    rentedQuantity: 2,
    warningThreshold: 3,
    records: [
      {
        type: '入库',
        quantity: 5,
        operator: '张三',
        time: '2023-12-20 10:00:00',
        remarks: '新购入设备'
      }
    ]
  },
  {
    equipmentId: 2,
    totalQuantity: 20,
    availableQuantity: 15,
    rentedQuantity: 5,
    warningThreshold: 5,
    records: [
      {
        type: '出库',
        quantity: 2,
        operator: '李四',
        time: '2023-12-19 14:30:00',
        remarks: '租赁出库'
      }
    ]
  }
]