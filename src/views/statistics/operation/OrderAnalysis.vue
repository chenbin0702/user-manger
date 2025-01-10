<template>
  <div class="order-analysis">
    <div class="header">
      <h2>订单分析</h2>
      <div class="actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dateShortcuts"
          @change="handleDateChange"
        />
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总订单数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.totalOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>完成订单</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.completedOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>转化率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.conversionRate }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>客单价</span>
            </div>
          </template>
          <div class="card-content">¥{{ statistics.averageOrderValue }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>订单趋势</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>订单类型分布</span>
            </div>
          </template>
          <div ref="typeChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单分析表格 -->
    <el-card class="analysis-card">
      <template #header>
        <div class="card-header">
          <span>订单分析</span>
        </div>
      </template>
      <el-table :data="orderAnalysis" style="width: 100%">
        <el-table-column prop="type" label="订单类型" width="150" />
        <el-table-column prop="count" label="订单数" width="120" />
        <el-table-column prop="amount" label="订单金额" width="150">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="percentage" label="占比" width="120">
          <template #default="{ row }">
            {{ row.percentage }}%
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="环比" width="150">
          <template #default="{ row }">
            <el-tag :type="row.trend >= 0 ? 'success' : 'danger'">
              {{ row.trend >= 0 ? '+' : '' }}{{ row.trend }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

// 日期范围
const dateRange = ref([])
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    }
  },
  {
    text: '最近三月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    }
  }
]

// 统计数据
const statistics = ref({
  totalOrders: 3256,
  completedOrders: 2890,
  conversionRate: 88.7,
  averageOrderValue: 2580.50
})

// 订单分析数据
const orderAnalysis = ref([
  {
    type: '设备租赁',
    count: 1580,
    amount: 458600,
    percentage: 45.8,
    trend: 12.5,
    description: '设备租赁订单'
  },
  {
    type: '培训课程',
    count: 980,
    amount: 296000,
    percentage: 29.6,
    trend: 8.3,
    description: '培训课程订单'
  },
  {
    type: '保险服务',
    count: 696,
    amount: 158000,
    percentage: 15.8,
    trend: -3.2,
    description: '保险服务订单'
  }
])

// 图表引用
const trendChartRef = ref(null)
const typeChartRef = ref(null)
let trendChart = null
let typeChart = null

// 初始化图表
const initCharts = () => {
  // 订单趋势图
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toLocaleDateString()
    }).reverse()
    
    trendChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单数',
          type: 'line',
          smooth: true,
          data: [150, 180, 160, 180, 150, 200, 180]
        }
      ]
    })
  }

  // 订单类型分布图
  if (typeChartRef.value) {
    typeChart = echarts.init(typeChartRef.value)
    typeChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: orderAnalysis.value.map(item => ({
            name: item.type,
            value: item.percentage
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }
}

// 导出数据
const exportData = () => {
  try {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(orderAnalysis.value)
    XLSX.utils.book_append_sheet(wb, ws, '订单分析')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '订单分析报告.xlsx')
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 日期变化处理
const handleDateChange = () => {
  loadData()
}

// 加载数据
const loadData = () => {
  // 实现数据加载逻辑
  initCharts()
}

// 生命周期钩子
onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (trendChart) trendChart.dispose()
  if (typeChart) typeChart.dispose()
})

const handleResize = () => {
  if (trendChart) trendChart.resize()
  if (typeChart) typeChart.resize()
}
</script>

<style scoped>
.order-analysis {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 16px;
}

.statistics-cards {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  padding: 10px 0;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart {
  height: 300px;
}

.analysis-card {
  margin-bottom: 20px;
}
</style>