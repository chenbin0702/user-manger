<template>
  <div class="order-statistics">
    <div class="header">
      <h2>订单统计分析</h2>
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
        <el-radio-group v-model="timeUnit" @change="handleTimeUnitChange">
          <el-radio-button label="day">日</el-radio-button>
          <el-radio-button label="week">周</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
          <el-radio-button label="year">年</el-radio-button>
        </el-radio-group>
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
              <span>总金额</span>
            </div>
          </template>
          <div class="card-content">¥{{ formatAmount(statistics.totalAmount) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>完成率</span>
            </div>
          </template>
          <div class="card-content">{{ completionRate }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>平均订单金额</span>
            </div>
          </template>
          <div class="card-content">¥{{ formatAmount(averageAmount) }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>订单类型分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>订单趋势</span>
            </div>
          </template>
          <div ref="lineChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单分类统计表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>订单分类统计</span>
        </div>
      </template>
      <el-table :data="categoryStats" style="width: 100%">
        <el-table-column prop="type" label="订单类型" />
        <el-table-column prop="count" label="订单数量" />
        <el-table-column prop="amount" label="订单金额">
          <template #default="{ row }">
            ¥{{ formatAmount(row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="percentage" label="占比">
          <template #default="{ row }">
            {{ row.percentage }}%
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import { formatAmount } from '@/utils/format'
import { orderService } from '@/services/orderService'

// 状态定义
const dateRange = ref([])
const timeUnit = ref('month')
const statistics = ref({
  totalOrders: 0,
  totalAmount: 0,
  typeDistribution: []
})
const categoryStats = ref([])
const pieChartRef = ref(null)
const lineChartRef = ref(null)
let pieChart = null
let lineChart = null

// 计算属性
const completionRate = computed(() => {
  return ((statistics.value.completed / statistics.value.totalOrders) * 100).toFixed(2)
})

const averageAmount = computed(() => {
  return statistics.value.totalOrders ? statistics.value.totalAmount / statistics.value.totalOrders : 0
})

// 日期快捷选项
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

// 方法定义
const loadData = async () => {
  try {
    const data = await orderService.getStatistics()
    statistics.value = data
    categoryStats.value = data.typeDistribution.map(item => ({
      type: item.type,
      count: Math.floor(item.value * statistics.value.totalOrders / 100),
      amount: (item.value * statistics.value.totalAmount / 100).toFixed(2),
      percentage: item.value
    }))
    initCharts()
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

const initCharts = () => {
  // 初始化饼图
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
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
          data: statistics.value.typeDistribution.map(item => ({
            name: item.type,
            value: item.value
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

  // 初始化折线图
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    // 模拟趋势数据
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toLocaleDateString()
    }).reverse()
    
    lineChart.setOption({
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
          data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
          type: 'line',
          smooth: true
        }
      ]
    })
  }
}

const handleDateChange = () => {
  loadData()
}

const handleTimeUnitChange = () => {
  loadData()
}

const exportData = () => {
  try {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(categoryStats.value)
    XLSX.utils.book_append_sheet(wb, ws, '订单统计')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '订单统计.xlsx')
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 生命周期钩子
onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (pieChart) pieChart.dispose()
  if (lineChart) lineChart.dispose()
})

const handleResize = () => {
  if (pieChart) pieChart.resize()
  if (lineChart) lineChart.resize()
}
</script>

<style scoped>
.order-statistics {
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

.table-card {
  margin-bottom: 20px;
}
</style>