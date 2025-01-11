<template>
  <div class="statistics-section">
    <el-card shadow="hover" class="statistics-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon><TrendCharts /></el-icon>
            <span>订单数据概览</span>
          </div>
          <el-radio-group v-model="period" @change="handlePeriodChange">
            <el-tooltip content="按日统计" placement="top">
              <el-radio-button label="day">日</el-radio-button>
            </el-tooltip>
            <el-tooltip content="按周统计" placement="top">
              <el-radio-button label="week">周</el-radio-button>
            </el-tooltip>
            <el-tooltip content="按月统计" placement="top">
              <el-radio-button label="month">月</el-radio-button>
            </el-tooltip>
            <el-tooltip content="按年统计" placement="top">
              <el-radio-button label="year">年</el-radio-button>
            </el-tooltip>
          </el-radio-group>
        </div>
      </template>
      
      <div class="statistics-content">
        <div class="overview-row">
          <div class="statistics-item">
            <div class="item-icon primary">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="item-content">
              <div class="item-label">总订单数</div>
              <div class="item-value primary">{{ statistics.totalOrders }}</div>
              <div class="item-trend">
                <span class="trend-label">较上期</span>
                <span class="trend-value up">
                  <el-icon><CaretTop /></el-icon>12.5%
                </span>
              </div>
            </div>
          </div>
          <div class="statistics-item">
            <div class="item-icon success">
              <el-icon><Money /></el-icon>
            </div>
            <div class="item-content">
              <div class="item-label">总金额</div>
              <div class="item-value success">¥{{ formatAmount(statistics.totalAmount) }}</div>
              <div class="item-trend">
                <span class="trend-label">较上期</span>
                <span class="trend-value up">
                  <el-icon><CaretTop /></el-icon>8.3%
                </span>
              </div>
            </div>
          </div>
          <div class="statistics-item">
            <div class="item-icon info">
              <el-icon><PriceTag /></el-icon>
            </div>
            <div class="item-content">
              <div class="item-label">平均客单价</div>
              <div class="item-value info">¥{{ formatAmount(statistics.totalAmount / statistics.totalOrders) }}</div>
              <div class="item-trend">
                <span class="trend-label">较上期</span>
                <span class="trend-value down">
                  <el-icon><CaretBottom /></el-icon>3.2%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="distribution-row">
          <div class="statistics-item">
            <div class="distribution-section">
              <div class="section-header">
                <div class="item-icon warning">
                  <el-icon><DataLine /></el-icon>
                </div>
                <div class="item-label">订单分布</div>
              </div>
              <div class="distribution">
                <div v-for="dist in statistics.typeDistribution" :key="dist.type" class="distribution-item">
                  <el-progress 
                    :percentage="dist.value"
                    :stroke-width="8"
                    :color="getProgressColors(dist.type)"
                    :show-text="false"
                  >
                    <template #default="{ percentage }">
                      <span class="progress-label">{{ dist.type }}</span>
                      <span class="progress-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                  <div class="progress-info">
                    <span class="progress-label">{{ dist.type }}</span>
                    <div class="progress-details">
                      <span class="detail-item">订单数: {{ Math.floor(statistics.totalOrders * dist.value / 100) }}</span>
                      <span class="detail-item">金额: ¥{{ formatAmount(statistics.totalAmount * dist.value / 100) }}</span>
                      <span class="progress-value" :style="{ color: getProgressColors(dist.type) }">
                        {{ dist.value }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatAmount } from '@/utils/format'
import { TrendCharts, ShoppingCart, Money, DataLine, PriceTag, CaretTop, CaretBottom } from '@element-plus/icons-vue'

const props = defineProps({
  statistics: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['period-change'])
const period = ref('day')

const getProgressColors = (type) => {
  const colors = {
    '设备租赁': {
      color: '#FF6B6B',
      background: 'rgba(255,107,107,.1)'
    },
    '培训课程': {
      color: '#4B9EFF',
      background: 'rgba(75,158,255,.1)'
    },
    '保险服务': {
      color: '#4CD964',
      background: 'rgba(76,217,100,.1)'
    },
    '其他': {
      color: '#FFAF36',
      background: 'rgba(255,175,54,.1)'
    }
  }
  console.log('first', colors[type]?.color)
  return colors[type]?.color || colors['其他'].color
}

const handlePeriodChange = (value) => {
  emit('period-change', value)
}
</script>

<style scoped>
.statistics-section {
  margin-bottom: 20px;
}

.statistics-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;

  .el-icon {
    font-size: 20px;
    color: #409EFF;
  }
}

:deep(.el-card__body) {
  padding: 16px;
  background-color: #fafafa;
}

.statistics-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.overview-row {
  display: flex;
  gap: 12px;
}

.distribution-row {
  flex: 1;
}

.statistics-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  flex: 1;
}

.distribution-section {
  width: 100%;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.primary {
    background-color: rgba(64,158,255,.1);
    color: #409EFF;
  }
  &.success {
    background-color: rgba(103,194,58,.1);
    color: #67C23A;
  }
  &.warning {
    background-color: rgba(230,162,60,.1);
    color: #E6A23C;
  }
  &.info {
    background-color: rgba(144,147,153,.1);
    color: #909399;
  }
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-label {
  color: #909399;
  margin-bottom: 8px;
  font-size: 14px;
}

.item-value {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
}

.distribution {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.distribution-item {
  width: 100%;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  &:hover {
    background-color: #f0f2f5;
  }
  &:nth-child(1) {
    :deep(.el-progress-bar__outer) {
      background-color: #F5F7FA;
    }
    :deep(.el-progress-bar__inner) {
      background-color: #FF6B6B;
    }
  }
  &:nth-child(2) {
    :deep(.el-progress-bar__outer) {
      background-color: #F5F7FA;
    }
    :deep(.el-progress-bar__inner) {
      background-color: #4B9EFF;
    }
  }
  &:nth-child(3) {
    :deep(.el-progress-bar__outer) {
      background-color: #F5F7FA;
    }
    :deep(.el-progress-bar__inner) {
      background-color: #4CD964;
    }
  }
  &:nth-child(4) {
    :deep(.el-progress-bar__outer) {
      background-color: #F5F7FA;
    }
    :deep(.el-progress-bar__inner) {
      background-color: #FFAF36;
    }
  }
}

:deep(.el-progress) {
  margin-bottom: 10px;
  
  .el-progress-bar__outer {
    height: 8px !important;
    border-radius: 4px;
    background-color: #F5F7FA !important;
  }
  
  .el-progress-bar__inner {
    border-radius: 4px;
    transition: all 0.3s ease;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg,
        rgba(255,255,255,0.1),
        rgba(255,255,255,0.2)
      );
      border-radius: inherit;
    }
  }
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.progress-label {
  color: #606266;
  font-size: 13px;
  font-weight: 500;
}

.progress-value {
  font-weight: 500;
  color: #606266;
}

:deep(.el-radio-group) {
  .el-radio-button__inner {
    padding: 8px 16px;
  }
}

.item-trend {
  display: flex;
  align-items: center; 
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
}

.trend-label {
  color: #909399;
}

.trend-value {
  display: flex;
  align-items: center;
  gap: 2px;
  
  &.up {
    color: #67C23A;
  }
  
  &.down {
    color: #F56C6C;
  }
  
  .el-icon {
    font-size: 12px;
  }
}

.progress-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-item {
  color: #606266;
  font-size: 13px;
}

.item-value {
  &.info {
    color: #909399;
  }
}
</style>