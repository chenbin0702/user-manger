<template>
  <el-dialog
    v-model="dialogVisible"
    title="订单详情"
    width="800px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="订单编号">
        {{ orderData?.orderNo }}
      </el-descriptions-item>
      <el-descriptions-item label="订单类型">
        {{ orderData?.type }}
      </el-descriptions-item>
      <el-descriptions-item label="客户姓名">
        {{ orderData?.customerName }}
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">
        {{ orderData?.customerPhone }}
      </el-descriptions-item>
      <el-descriptions-item label="订单金额">
        ¥{{ formatAmount(orderData?.amount || 0) }}
      </el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag :type="getStatusType(orderData?.status)">
          {{ orderData?.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ orderData?.createTime }}
      </el-descriptions-item>
      <el-descriptions-item label="更新时间">
        {{ orderData?.updateTime }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" :span="2">
        {{ orderData?.remarks || '无' }}
      </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { formatAmount } from '@/utils/format'

const props = defineProps({
  visible: Boolean,
  orderData: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const getStatusType = (status) => {
  const types = {
    '待付款': 'warning',
    '进行中': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  }
  return types[status] || 'info'
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>