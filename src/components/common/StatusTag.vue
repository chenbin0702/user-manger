<template>
  <el-tag :type="getTagType">{{ status }}</el-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  typeMap: {
    type: Object,
    default: () => ({
      '启用': 'success',
      '禁用': 'danger',
      '待审核': 'warning',
      '已通过': 'success',
      '已拒绝': 'danger'
    })
  }
})

const getTagType = computed(() => props.typeMap[props.status] || 'info')
</script>