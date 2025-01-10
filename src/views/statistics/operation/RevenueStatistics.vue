<template>
  <div class="revenue-statistics">
    <div class="header">
      <h2>收入统计</h2>
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
              <span>总收入</span>
            </div>
          </template>
          <div class="card-content">¥{{ formatAmount(statistics.totalRevenue) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月收入</span>
            </div>
          </template>
          <div class="card-content">¥{{ formatAmount(statistics.monthlyRevenue) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>同比增长</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.yearOverYear }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>环比增长</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.monthOverMonth }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>收入趋势</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>收入构成</span>
            </div>
          </template>
          <div ref="compositionChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收入明细表格 -->
    <el-card class="details-card">
      <template #header>
        <div class="card-header">
          <span>收入明细</span>
        </div>
      </template>
      <el-table :data="revenueDetails" style="width: 100%">
        <el-table-column prop="source" label="收入来源" width="150" />
        <el-table-column prop="amount" label="金额" width="150">
          <template #default="{ row }">
            ¥{{ formatAmount(row.amount) }}
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
import { formatAmount } from '@/utils/format'

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
  totalRevenue: 1258600.00,
  monthlyRevenue: 298600.00,
  yearOverYear: 25.8,
  monthOverMonth: 12.5
})

// 收入明细数据
const revenueDetails = ref([
  {
    source: '设备租赁',
    amount: 458600.00,
    percentage: 45.8,
    trend: 12.5,
    description: '设备租赁收入'
  },
  {
    source: '培训课程',
    amount: 296000.00,
    percentage: 29.6,
    trend: 8.3,
    description: '培训课程收入'
  },
  {
    source: '保险服务',
    amount: 158000.00,
    percentage: 15.8,
    trend: -3.2,
    description: '保险服务收入'
  }
])

// 图表引用
const trendChartRef = ref(null)
const compositionChartRef = ref(null)
let trendChart = null
let compositionChart = null

// 初始化图表
const initCharts = () => {
  // 收入趋势图
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
          name: '收入',
          type: 'line',
          smooth: true,
          data: [150000, 180000, 160000, 180000, 150000, 200000, 180000]
        }
      ]
    })
  }

  // 收入构成图
  if (compositionChartRef.value) {
    compositionChart = echarts.init(compositionChartRef.value)
    compositionChart.setOption({
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
          data: revenueDetails.value.map(item => ({
            name: item.source,
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
    const ws = XLSX.utils.json_to_sheet(revenueDetails.value)
    XLSX.utils.book_append_sheet(wb, ws, '收入统计')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '收入统计报告.xlsx')
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
  if (compositionChart) compositionChart.dispose()
})

const handleResize = () => {
  if (trendChart) trendChart.resize()
  if (compositionChart) compositionChart.resize()
}
</script>

<style scoped>
.revenue-statistics {
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

.details-card {
  margin-bottom: 20px;
}
</style>