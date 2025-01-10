// 认证相关的模拟数据
export const mockIdentityVerifications = [
  {
    id: 1,
    name: '张三',
    idNumber: '330************123',
    phone: '138****1234',
    address: '浙江省杭州市西湖区',
    submitTime: '2023-12-20 10:00:00',
    status: '待审核'
  },
  {
    id: 2,
    name: '李四',
    idNumber: '440************456',
    phone: '139****5678',
    address: '广东省深圳市南山区',
    submitTime: '2023-12-19 14:30:00',
    status: '已通过'
  },
  {
    id: 3,
    name: '王五',
    idNumber: '110************789',
    phone: '137****9012',
    address: '北京市朝阳区',
    submitTime: '2023-12-18 09:15:00',
    status: '已拒绝'
  }
]

export const mockPilotQualifications = [
  {
    id: 1,
    name: '张三',
    licenseType: '无人机驾驶员合格证',
    experience: '3年',
    flightHours: 1000,
    submitTime: '2023-12-20 11:00:00',
    status: '待审核'
  },
  {
    id: 2,
    name: '李四',
    licenseType: '无人机驾驶员合格证',
    experience: '5年',
    flightHours: 2000,
    submitTime: '2023-12-19 15:30:00',
    status: '已通过'
  },
  {
    id: 3,
    name: '王五',
    licenseType: '无人机驾驶员合格证',
    experience: '2年',
    flightHours: 500,
    submitTime: '2023-12-18 10:15:00',
    status: '已拒绝'
  }
]