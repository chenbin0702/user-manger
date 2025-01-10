<template>
  <div class="dashboard">
    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="6" v-for="card in overviewCards" :key="card.title">
        <el-card shadow="hover" class="overview-card">
          <div class="card-content">
            <div class="card-icon" :style="{ backgroundColor: card.bgColor }">
              <el-icon><component :is="card.icon" /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
              <div class="card-compare">
                较昨日
                <span :class="card.trend >= 0 ? 'up' : 'down'">
                  {{ Math.abs(card.trend) }}%
                  <el-icon>
                    <CaretTop v-if="card.trend >= 0" />
                    <CaretBottom v-else />
                  </el-icon>
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-container">
      <el-col :span="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>租赁订单趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-content">
            <v-chart class="chart" :option="orderTrendOption" autoresize />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>设备类型分布</span>
            </div>
          </template>
          <div class="chart-content">
            <v-chart class="chart" :option="equipmentTypeOption" autoresize />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新动态 -->
    <el-row :gutter="20" class="activity-container">
      <el-col :span="12">
        <el-card shadow="hover" class="activity-card">
          <template #header>
            <div class="card-header">
              <span>最新订单</span>
              <el-button text>查看更多</el-button>
            </div>
          </template>
          <el-table :data="latestOrders" style="width: 100%" :show-header="false">
            <el-table-column width="180">
              <template #default="{ row }">
                <div class="order-info">
                  <el-avatar :size="32" :src="row.userAvatar" />
                  <div class="order-user">
                    <div class="username">{{ row.username }}</div>
                    <div class="time">{{ row.time }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{ row }">
                <div class="order-content">
                  <div class="order-type">{{ row.type }}</div>
                  <div class="order-amount">¥{{ row.amount }}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="activity-card">
          <template #header>
            <div class="card-header">
              <span>系统通知</span>
              <el-button text>查看更多</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(notice, index) in systemNotices"
              :key="index"
              :type="notice.type"
              :timestamp="notice.time"
              :color="notice.color"
            >
              {{ notice.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as echarts from 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import {
  User,
  Box,
  Tickets,
  Money,
  CaretTop,
  CaretBottom
} from '@element-plus/icons-vue'

// 数据概览卡片数据
const overviewCards = [
  {
    title: '总用户数',
    value: '12,789',
    trend: 12.5,
    icon: 'User',
    bgColor: '#409EFF'
  },
  {
    title: '设备总数',
    value: '358',
    trend: -2.8,
    icon: 'Box',
    bgColor: '#67C23A'
  },
  {
    title: '本月订单',
    value: '1,234',
    trend: 8.4,
    icon: 'Tickets',
    bgColor: '#E6A23C'
  },
  {
    title: '月收入(万元)',
    value: '89.6',
    trend: 15.3,
    icon: 'Money',
    bgColor: '#F56C6C'
  }
]

// 时间范围选择
const timeRange = ref('month')

// 订单趋势图配置
const orderTrendOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['租赁订单', '培训订单']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '租赁订单',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: '培训订单',
      type: 'line',
      smooth: true,
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
}

// 设备类型分布图配置
const equipmentTypeOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '设备类型',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 335, name: '多旋翼无人机' },
        { value: 310, name: '固定翼无人机' },
        { value: 234, name: '垂直起降无人机' },
        { value: 135, name: '无人直升机' },
        { value: 148, name: '其他设备' }
      ]
    }
  ]
}

// 最新订单数据
const latestOrders = [
  {
    username: '张三',
    userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    time: '2024-03-10 14:23',
    type: '设备租赁',
    amount: '2,380.00'
  },
  // ... 更多订单数据
]

// 系统通知数据
const systemNotices = [
  {
    content: '新版本 V2.1.0 发布',
    time: '2024-03-10 10:00',
    type: 'success',
    color: '#67C23A'
  },
  {
    content: '系统将于今晚 23:00 进行维护',
    time: '2024-03-10 09:30',
    type: 'warning',
    color: '#E6A23C'
  },
  // ... 更多通知数据
]
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.data-overview {
  margin-bottom: 20px;
}

.overview-card {
  .card-content {
    display: flex;
    align-items: center;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;

    .el-icon {
      font-size: 24px;
      color: #fff;
    }
  }

  .card-info {
    flex: 1;
  }

  .card-title {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
  }

  .card-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 4px;
  }

  .card-compare {
    font-size: 12px;
    color: #909399;

    .up {
      color: #67C23A;
    }

    .down {
      color: #F56C6C;
    }
  }
}

.charts-container {
  margin-bottom: 20px;

  .chart-card {
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart-content {
      height: 350px;

      .chart {
        height: 100%;
      }
    }
  }
}

.activity-container {
  .activity-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .order-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .order-user {
      .username {
        font-weight: bold;
        margin-bottom: 4px;
      }

      .time {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .order-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .order-type {
      color: #606266;
    }

    .order-amount {
      font-weight: bold;
      color: #F56C6C;
    }
  }
}

:deep(.el-timeline-item__node) {
  background-color: transparent;
  border: 2px solid var(--el-color-primary);
}

:deep(.el-timeline-item__tail) {
  border-left: 2px solid #E4E7ED;
}
</style> 