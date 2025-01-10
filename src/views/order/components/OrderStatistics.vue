<template>
  <div class="statistics-section">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单统计</span>
          <el-radio-group v-model="period" @change="handlePeriodChange">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="statistics-item">
            <div class="item-label">总订单数</div>
            <div class="item-value">{{ statistics.totalOrders }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="statistics-item">
            <div class="item-label">总金额</div>
            <div class="item-value">¥{{ formatAmount(statistics.totalAmount) }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="statistics-item">
            <div class="item-label">订单分布</div>
            <div class="distribution">
              <div v-for="item in statistics.typeDistribution" :key="item.type" class="distribution-item">
                <span>{{ item.type }}</span>
                <span>{{ item.value }}%</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatAmount } from '@/utils/format'

const props = defineProps({
  statistics: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['period-change'])

const period = ref('day')

const handlePeriodChange = (value) => {
  emit('period-change', value)
}
</script>

<style scoped>
.statistics-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistics-item {
  text-align: center;
  padding: 20px 0;
}

.item-label {
  color: #909399;
  margin-bottom: 10px;
}

.item-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>