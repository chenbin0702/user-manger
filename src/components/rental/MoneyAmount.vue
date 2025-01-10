<template>
  <span>¥{{ formatAmount(amount) }}</span>
</template>

<script setup>
import { formatAmount } from '@/utils/format'

defineProps({
  amount: {
    type: Number,
    required: true
  }
})
</script>