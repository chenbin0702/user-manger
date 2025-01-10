import { mockIdentityVerifications, mockPilotQualifications } from '../mock/verifications'
import { mockCertificates } from '../mock/certificates'

// 认证管理相关的 API 服务
export const authService = {
  // 获取实名认证列表
  getIdentityVerifications(params) {
    const { page = 1, pageSize = 10, keyword = '', status = '' } = params || {}
    let list = [...mockIdentityVerifications]
    
    if (keyword) {
      list = list.filter(item => 
        item.name.includes(keyword) || 
        item.idNumber.includes(keyword)
      )
    }
    
    if (status) {
      list = list.filter(item => item.status === status)
    }
    
    return Promise.resolve({
      total: list.length,
      list: list.slice((page - 1) * pageSize, page * pageSize)
    })
  },

  // 获取飞手资质审核列表
  getPilotQualifications(params) {
    const { page = 1, pageSize = 10, keyword = '', status = '' } = params || {}
    let list = [...mockPilotQualifications]
    
    if (keyword) {
      list = list.filter(item => 
        item.name.includes(keyword) || 
        item.licenseType.includes(keyword)
      )
    }
    
    if (status) {
      list = list.filter(item => item.status === status)
    }
    
    return Promise.resolve({
      total: list.length,
      list: list.slice((page - 1) * pageSize, page * pageSize)
    })
  },

  // 获取证书列表
  getCertificates() {
    return Promise.resolve(mockCertificates)
  },

  // 创建证书
  createCertificate(certificateData) {
    const newCertificate = {
      id: Math.max(...mockCertificates.map(c => c.id)) + 1,
      ...certificateData
    }
    mockCertificates.push(newCertificate)
    return Promise.resolve(newCertificate)
  },

  // 更新证书
  updateCertificate(id, certificateData) {
    const index = mockCertificates.findIndex(c => c.id === id)
    if (index > -1) {
      mockCertificates[index] = { ...mockCertificates[index], ...certificateData }
      return Promise.resolve(mockCertificates[index])
    }
    return Promise.reject(new Error('Certificate not found'))
  },

  // 删除证书
  deleteCertificate(id) {
    const index = mockCertificates.findIndex(c => c.id === id)
    if (index > -1) {
      mockCertificates.splice(index, 1)
      return Promise.resolve({ success: true })
    }
    return Promise.reject(new Error('Certificate not found'))
  },

  // 审核操作
  updateVerificationStatus(id, status, remarks) {
    // 更新实名认证状态
    let verification = mockIdentityVerifications.find(v => v.id === id)
    if (verification) {
      verification.status = status
      verification.remarks = remarks
      verification.reviewTime = new Date().toISOString()
      return Promise.resolve({ success: true })
    }

    // 更新飞手资质状态
    verification = mockPilotQualifications.find(v => v.id === id)
    if (verification) {
      verification.status = status
      verification.remarks = remarks
      verification.reviewTime = new Date().toISOString()
      return Promise.resolve({ success: true })
    }

    return Promise.reject(new Error('Verification not found'))
  }
}