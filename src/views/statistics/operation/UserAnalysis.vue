<template>
  <div class="user-analysis">
    <div class="header">
      <h2>用户分析</h2>
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
              <span>总用户数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.totalUsers }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>新增用户</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.newUsers }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>活跃用户</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.activeUsers }}</div>
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
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
            </div>
          </template>
          <div ref="growthChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户分布</span>
            </div>
          </template>
          <div ref="distributionChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户行为分析 -->
    <el-card class="behavior-card">
      <template #header>
        <div class="card-header">
          <span>用户行为分析</span>
        </div>
      </template>
      <el-table :data="behaviorData" style="width: 100%">
        <el-table-column prop="behavior" label="行为类型" width="150" />
        <el-table-column prop="count" label="次数" width="120" />
        <el-table-column prop="percentage" label="占比" width="120">
          <template #default="{ row }">
            {{ row.percentage }}%
          </template>
        </el-table-column>
        <el-table-column prop="trend" label="趋势" width="180">
          <template #default="{ row }">
            <el-tag :type="row.trend === 'up' ? 'success' : 'danger'">
              {{ row.trend === 'up' ? '上升' : '下降' }}
              {{ row.trendValue }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
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
  totalUsers: 12580,
  newUsers: 256,
  activeUsers: 3680,
  conversionRate: 35.8
})

// 用户行为数据
const behaviorData = ref([
  {
    behavior: '浏览商品',
    count: 15680,
    percentage: 35.6,
    trend: 'up',
    trendValue: 12.5,
    description: '用户浏览商品详情页的次数'
  },
  {
    behavior: '加入购物车',
    count: 5890,
    percentage: 13.4,
    trend: 'up',
    trendValue: 8.3,
    description: '用户将商品加入购物车的次数'
  },
  {
    behavior: '下单',
    count: 2360,
    percentage: 5.4,
    trend: 'down',
    trendValue: 3.2,
    description: '用户成功提交订单的次数'
  }
])

// 图表引用
const growthChartRef = ref(null)
const distributionChartRef = ref(null)
let growthChart = null
let distributionChart = null

// 初始化图表
const initCharts = () => {
  // 用户增长趋势图
  if (growthChartRef.value) {
    growthChart = echarts.init(growthChartRef.value)
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toLocaleDateString()
    }).reverse()
    
    growthChart.setOption({
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
          name: '新增用户',
          type: 'line',
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210]
        }
      ]
    })
  }

  // 用户分布图
  if (distributionChartRef.value) {
    distributionChart = echarts.init(distributionChartRef.value)
    distributionChart.setOption({
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
          data: [
            { value: 45, name: '个人用户' },
            { value: 25, name: '企业用户' },
            { value: 15, name: '培训机构' },
            { value: 15, name: '其他' }
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
    const ws = XLSX.utils.json_to_sheet(behaviorData.value)
    XLSX.utils.book_append_sheet(wb, ws, '用户行为分析')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '用户分析报告.xlsx')
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
  if (growthChart) growthChart.dispose()
  if (distributionChart) distributionChart.dispose()
})

const handleResize = () => {
  if (growthChart) growthChart.resize()
  if (distributionChart) distributionChart.resize()
}
</script>

<style scoped>
.user-analysis {
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

.behavior-card {
  margin-bottom: 20px;
}
</style>