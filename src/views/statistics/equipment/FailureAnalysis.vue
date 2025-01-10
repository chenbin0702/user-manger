<template>
  <div class="failure-analysis">
    <div class="header">
      <h2>设备故障率统计</h2>
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
              <span>故障总数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.totalFailures }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>平均故障率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.averageFailureRate }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>维修中设备</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.underRepair }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>平均修复时间</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.averageRepairTime }}h</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>故障趋势</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>故障类型分布</span>
            </div>
          </template>
          <div ref="typeChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 故障详情表格 -->
    <el-card class="details-card">
      <template #header>
        <div class="card-header">
          <span>故障详情统计</span>
        </div>
      </template>
      <el-table :data="failureDetails" style="width: 100%">
        <el-table-column prop="type" label="故障类型" width="150" />
        <el-table-column prop="count" label="故障次数" width="120" />
        <el-table-column prop="rate" label="故障率" width="120">
          <template #default="{ row }">
            {{ row.rate }}%
          </template>
        </el-table-column>
        <el-table-column prop="avgRepairTime" label="平均修复时间" width="150" />
        <el-table-column prop="trend" label="趋势" width="150">
          <template #default="{ row }">
            <el-tag :type="row.trend >= 0 ? 'danger' : 'success'">
              {{ row.trend >= 0 ? '+' : '' }}{{ row.trend }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="impact" label="影响程度" width="120">
          <template #default="{ row }">
            <el-tag :type="getImpactType(row.impact)">{{ row.impact }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="solution" label="解决方案" />
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
  totalFailures: 156,
  averageFailureRate: 3.2,
  underRepair: 12,
  averageRepairTime: 4.5
})

// 故障详情数据
const failureDetails = ref([
  {
    type: '电池故障',
    count: 45,
    rate: 1.2,
    avgRepairTime: '2.5小时',
    trend: -15.5,
    impact: '中等',
    solution: '更换电池或维修充电系统'
  },
  {
    type: '电机故障',
    count: 38,
    rate: 1.0,
    avgRepairTime: '4.8小时',
    trend: 8.3,
    impact: '严重',
    solution: '更换电机或维修传动系统'
  },
  {
    type: '信号故障',
    count: 52,
    rate: 1.4,
    avgRepairTime: '1.5小时',
    trend: -5.2,
    impact: '轻微',
    solution: '检查天线和信号模块'
  }
])

// 获取影响程度标签类型
const getImpactType = (impact) => {
  const types = {
    '严重': 'danger',
    '中等': 'warning',
    '轻微': 'info'
  }
  return types[impact] || 'info'
}

// 图表引用
const trendChartRef = ref(null)
const typeChartRef = ref(null)
let trendChart = null
let typeChart = null

// 初始化图表
const initCharts = () => {
  // 故障趋势图
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
          name: '故障率',
          type: 'line',
          smooth: true,
          data: [3.5, 3.2, 3.8, 3.0, 3.4, 3.1, 3.2]
        }
      ]
    })
  }

  // 故障类型分布图
  if (typeChartRef.value) {
    typeChart = echarts.init(typeChartRef.value)
    typeChart.setOption({
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
          data: failureDetails.value.map(item => ({
            name: item.type,
            value: item.count
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
    const ws = XLSX.utils.json_to_sheet(failureDetails.value)
    XLSX.utils.book_append_sheet(wb, ws, '设备故障分析')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '设备故障分析.xlsx')
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
.failure-analysis {
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