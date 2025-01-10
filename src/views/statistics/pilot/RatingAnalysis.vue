<template>
  <div class="pilot-rating-analysis">
    <div class="header">
      <h2>飞手评分分析</h2>
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
              <span>平均评分</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.averageRating }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>五星率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.fiveStarRate }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>好评数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.positiveReviews }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>投诉率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.complaintRate }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>评分趋势</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>评分分布</span>
            </div>
          </template>
          <div ref="distributionChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 评价详情 -->
    <el-card class="reviews-card">
      <template #header>
        <div class="card-header">
          <span>评价详情</span>
          <el-radio-group v-model="reviewType" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="positive">好评</el-radio-button>
            <el-radio-button label="negative">差评</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="filteredReviews" style="width: 100%">
        <el-table-column prop="pilotName" label="飞手姓名" width="120" />
        <el-table-column prop="orderNo" label="订单编号" width="120" />
        <el-table-column prop="taskType" label="任务类型" width="120" />
        <el-table-column prop="rating" label="评分" width="180">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="评价内容" show-overflow-tooltip />
        <el-table-column prop="reviewTime" label="评价时间" width="180" />
      </el-table>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
  averageRating: 4.8,
  fiveStarRate: 85.6,
  positiveReviews: 1280,
  complaintRate: 0.5
})

// 评价类型和分页
const reviewType = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 评价数据
const reviews = ref([
  {
    pilotName: '张三',
    orderNo: 'ORD20240120001',
    taskType: '航拍任务',
    rating: 5,
    comment: '飞手专业素质高，拍摄效果很好',
    reviewTime: '2024-01-20 10:00:00'
  },
  {
    pilotName: '李四',
    orderNo: 'ORD20240120002',
    taskType: '测绘任务',
    rating: 4.5,
    comment: '任务完成及时，态度认真负责',
    reviewTime: '2024-01-20 11:30:00'
  }
])

// 筛选评价
const filteredReviews = computed(() => {
  let filtered = [...reviews.value]
  if (reviewType.value === 'positive') {
    filtered = filtered.filter(review => review.rating >= 4)
  } else if (reviewType.value === 'negative') {
    filtered = filtered.filter(review => review.rating < 4)
  }
  return filtered
})

// 图表引用
const trendChartRef = ref(null)
const distributionChartRef = ref(null)
let trendChart = null
let distributionChart = null

// 初始化图表
const initCharts = () => {
  // 评分趋势图
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
        type: 'value',
        min: 4,
        max: 5
      },
      series: [
        {
          name: '平均评分',
          type: 'line',
          smooth: true,
          data: [4.8, 4.7, 4.9, 4.8, 4.7, 4.8, 4.9]
        }
      ]
    })
  }

  // 评分分布图
  if (distributionChartRef.value) {
    distributionChart = echarts.init(distributionChartRef.value)
    distributionChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}次 ({d}%)'
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
            { value: 856, name: '5星' },
            { value: 285, name: '4星' },
            { value: 98, name: '3星' },
            { value: 35, name: '2星' },
            { value: 6, name: '1星' }
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
    const ws = XLSX.utils.json_to_sheet(reviews.value)
    XLSX.utils.book_append_sheet(wb, ws, '飞手评分分析')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '飞手评分分析.xlsx')
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 日期变化处理
const handleDateChange = () => {
  loadData()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
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
  if (distributionChart) distributionChart.dispose()
})

const handleResize = () => {
  if (trendChart) trendChart.resize()
  if (distributionChart) distributionChart.resize()
}
</script>

<style scoped>
.pilot-rating-analysis {
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

.reviews-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>