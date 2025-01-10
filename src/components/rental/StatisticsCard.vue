<template>
  <el-card class="statistics-card">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <div class="statistics-value">
      <money-amount :amount="value" />
    </div>
  </el-card>
</template>

<script setup>
import MoneyAmount from './MoneyAmount.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.statistics-card {
  margin-bottom: 20px;
}

.statistics-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  padding: 20px 0;
}
</style>