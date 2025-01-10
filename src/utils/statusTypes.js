export const statusTypes = {
  '启用': 'success',
  '禁用': 'danger',
  '待审核': 'warning',
  '已通过': 'success',
  '已拒绝': 'danger'
}

export const getStatusType = (status) => statusTypes[status] || 'info'