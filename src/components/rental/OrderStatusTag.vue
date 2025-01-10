<template>
  <el-tag :type="getStatusType">{{ status }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const getStatusType = computed(() => {
  const types = {
    '待支付': 'warning',
    '进行中': 'primary',
    '已完成': 'success',
    '已取消': 'info',
    '待退还': 'warning',
    '已退还': 'success',
    '已扣除': 'danger'
  }
  return types[props.status] || 'info'
})
</script>