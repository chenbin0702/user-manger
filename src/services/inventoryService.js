// Mock data for inventory management
const mockInventory = [
  {
    id: 1,
    name: 'DJI Mavic 3',
    model: 'M3P',
    quantity: 10,
    minQuantity: 5,
    location: '仓库A',
    status: '正常',
    lastUpdate: '2024-01-20 10:00:00'
  },
  {
    id: 2,
    name: 'DJI Mini 3',
    model: 'M3',
    quantity: 3,
    minQuantity: 5,
    location: '仓库B',
    status: '低库存',
    lastUpdate: '2024-01-19 15:30:00'
  }
]

const mockRecords = [
  {
    id: 1,
    inventoryId: 1,
    type: '入库',
    quantity: 5,
    operator: '张三',
    time: '2024-01-20 10:00:00',
    remarks: '新购入设备'
  },
  {
    id: 2,
    inventoryId: 1,
    type: '出库',
    quantity: -2,
    operator: '李四',
    time: '2024-01-19 14:30:00',
    remarks: '租赁出库'
  }
]

export const inventoryService = {
  // Get inventory list with filtering and pagination
  getInventoryList(params = {}) {
    const { page = 1, pageSize = 10, keyword = '', location = '', status = '' } = params
    let list = [...mockInventory]
    
    if (keyword) {
      list = list.filter(item => 
        item.name.includes(keyword) || 
        item.model.includes(keyword)
      )
    }
    
    if (location) {
      list = list.filter(item => item.location === location)
    }
    
    if (status) {
      list = list.filter(item => item.status === status)
    }
    
    return Promise.resolve({
      total: list.length,
      list: list.slice((page - 1) * pageSize, page * pageSize)
    })
  },

  // Get inventory statistics
  getStatistics() {
    return Promise.resolve({
      total: mockInventory.reduce((sum, item) => sum + item.quantity, 0),
      warning: mockInventory.filter(item => item.quantity <= item.minQuantity).length,
      inbound: mockRecords.filter(r => r.type === '入库').reduce((sum, r) => sum + r.quantity, 0),
      outbound: Math.abs(mockRecords.filter(r => r.type === '出库').reduce((sum, r) => sum + r.quantity, 0))
    })
  },

  // Get inventory records
  getInventoryRecords(inventoryId) {
    const records = mockRecords.filter(r => r.inventoryId === inventoryId)
    return Promise.resolve(records)
  },

  // Create inventory
  createInventory(data) {
    const newInventory = {
      id: Math.max(...mockInventory.map(i => i.id)) + 1,
      ...data,
      status: data.quantity <= data.minQuantity ? '低库存' : '正常',
      lastUpdate: new Date().toISOString()
    }
    mockInventory.push(newInventory)
    return Promise.resolve(newInventory)
  },

  // Update inventory
  updateInventory(id, data) {
    const index = mockInventory.findIndex(i => i.id === id)
    if (index > -1) {
      mockInventory[index] = {
        ...mockInventory[index],
        ...data,
        status: data.quantity <= data.minQuantity ? '低库存' : '正常',
        lastUpdate: new Date().toISOString()
      }
      return Promise.resolve(mockInventory[index])
    }
    return Promise.reject(new Error('Inventory not found'))
  },

  // Delete inventory
  deleteInventory(id) {
    const index = mockInventory.findIndex(i => i.id === id)
    if (index > -1) {
      mockInventory.splice(index, 1)
      return Promise.resolve({ success: true })
    }
    return Promise.reject(new Error('Inventory not found'))
  }
}