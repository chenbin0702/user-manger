<template>
  <div class="pilot-order-statistics">
    <div class="header">
      <h2>飞手接单统计</h2>
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
              <span>总接单数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.totalOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>完成率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.completionRate }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>平均时长</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.averageDuration }}h</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总收入</span>
            </div>
          </template>
          <div class="card-content">¥{{ formatAmount(statistics.totalIncome) }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>接单趋势</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>任务类型分布</span>
            </div>
          </template>
          <div ref="typeChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 飞手排行榜 -->
    <el-card class="ranking-card">
      <template #header>
        <div class="card-header">
          <span>飞手排行榜</span>
          <el-radio-group v-model="rankingType" size="small">
            <el-radio-button label="orders">接单数</el-radio-button>
            <el-radio-button label="income">收入</el-radio-button>
            <el-radio-button label="completion">完成率</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="pilotRankings" style="width: 100%">
        <el-table-column type="index" label="排名" width="80" />
        <el-table-column prop="name" label="飞手姓名" width="120" />
        <el-table-column prop="orderCount" label="接单数" width="120" v-if="rankingType === 'orders'" />
        <el-table-column prop="income" label="收入" width="150" v-if="rankingType === 'income'">
          <template #default="{ row }">
            ¥{{ formatAmount(row.income) }}
          </template>
        </el-table-column>
        <el-table-column prop="completionRate" label="完成率" width="120" v-if="rankingType === 'completion'">
          <template #default="{ row }">
            {{ row.completionRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" width="120">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column prop="mainTask" label="主要任务类型" />
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
  totalOrders: 1256,
  completionRate: 95.8,
  averageDuration: 4.5,
  totalIncome: 298600
})

// 排行榜类型
const rankingType = ref('orders')

// 飞手排行数据
const pilotRankings = ref([
  {
    name: '张三',
    orderCount: 156,
    income: 58600,
    completionRate: 98.5,
    rating: 4.8,
    mainTask: '航拍任务'
  },
  {
    name: '李四',
    orderCount: 142,
    income: 52400,
    completionRate: 97.2,
    rating: 4.7,
    mainTask: '测绘任务'
  },
  {
    name: '王五',
    orderCount: 128,
    income: 48900,
    completionRate: 96.8,
    rating: 4.6,
    mainTask: '巡检任务'
  }
])

// 图表引用
const trendChartRef = ref(null)
const typeChartRef = ref(null)
let trendChart = null
let typeChart = null

// 初始化图表
const initCharts = () => {
  // 接单趋势图
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
          name: '接单数',
          type: 'line',
          smooth: true,
          data: [42, 45, 38, 50, 42, 48, 45]
        }
      ]
    })
  }

  // 任务类型分布图
  if (typeChartRef.value) {
    typeChart = echarts.init(typeChartRef.value)
    typeChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}单 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 580, name: '航拍任务' },
            { value: 420, name: '测绘任务' },
            { value: 256, name: '巡检任务' }
          ],
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
    const ws = XLSX.utils.json_to_sheet(pilotRankings.value)
    XLSX.utils.book_append_sheet(wb, ws, '飞手接单统计')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '飞手接单统计.xlsx')
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
.pilot-order-statistics {
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

.ranking-card {
  margin-bottom: 20px;
}
</style>