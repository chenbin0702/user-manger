import { mockDeposits } from '@/mock/rental'

export const depositService = {
  // Get deposit records with filtering and pagination
  getDeposits(params = {}) {
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

  // Process deposit refund
  processRefund(depositId, data) {
    const deposit = mockDeposits.find(d => d.id === depositId)
    if (!deposit) {
      return Promise.reject(new Error('Deposit record not found'))
    }

    deposit.status = '已退还'
    deposit.refundTime = new Date().toISOString()
    deposit.refundAmount = data.amount
    deposit.remarks = data.remarks

    return Promise.resolve({ success: true })
  }
}