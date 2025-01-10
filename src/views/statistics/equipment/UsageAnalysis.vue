<template>
  <div class="usage-analysis">
    <div class="header">
      <h2>设备使用率分析</h2>
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
              <span>平均使用率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.averageUsage }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>高峰使用率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.peakUsage }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>设备总数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.totalEquipment }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>在用设备</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.inUseEquipment }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>使用率趋势</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>设备类型使用率</span>
            </div>
          </template>
          <div ref="typeChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 使用率详情表格 -->
    <el-card class="details-card">
      <template #header>
        <div class="card-header">
          <span>设备使用率详情</span>
        </div>
      </template>
      <el-table :data="usageDetails" style="width: 100%">
        <el-table-column prop="type" label="设备类型" width="150" />
        <el-table-column prop="totalCount" label="设备数量" width="120" />
        <el-table-column prop="usageRate" label="使用率" width="120">
          <template #default="{ row }">
            {{ row.usageRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="avgDuration" label="平均使用时长" width="150" />
        <el-table-column prop="trend" label="趋势" width="150">
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
  averageUsage: 75.8,
  peakUsage: 95.2,
  totalEquipment: 156,
  inUseEquipment: 128
})

// 使用率详情数据
const usageDetails = ref([
  {
    type: '多旋翼无人机',
    totalCount: 80,
    usageRate: 85.5,
    avgDuration: '5.8小时/天',
    trend: 12.5,
    description: '主要用于航拍任务'
  },
  {
    type: '固定翼无人机',
    totalCount: 45,
    usageRate: 72.3,
    avgDuration: '4.2小时/天',
    trend: 8.3,
    description: '主要用于测绘任务'
  },
  {
    type: '垂直起降无人机',
    totalCount: 31,
    usageRate: 68.9,
    avgDuration: '3.9小时/天',
    trend: -3.2,
    description: '主要用于巡检任务'
  }
])

// 图表引用
const trendChartRef = ref(null)
const typeChartRef = ref(null)
let trendChart = null
let typeChart = null

// 初始化图表
const initCharts = () => {
  // 使用率趋势图
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
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '使用率',
          type: 'line',
          smooth: true,
          data: [65, 70, 75, 82, 78, 85, 80]
        }
      ]
    })
  }

  // 设备类型使用率图
  if (typeChartRef.value) {
    typeChart = echarts.init(typeChartRef.value)
    typeChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: usageDetails.value.map(item => ({
            name: item.type,
            value: item.usageRate
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
    const ws = XLSX.utils.json_to_sheet(usageDetails.value)
    XLSX.utils.book_append_sheet(wb, ws, '设备使用率分析')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '设备使用率分析.xlsx')
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
.usage-analysis {
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