<template>
  <div class="order-categories">
    <div class="header">
      <h2>订单分类统计</h2>
      <div class="actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
        />
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="6" v-for="item in categoryStats" :key="item.type">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ item.type }}</span>
            </div>
          </template>
          <div class="card-content">
            <div class="stat-item">
              <span class="label">订单数量</span>
              <span class="value">{{ item.count }}</span>
            </div>
            <div class="stat-item">
              <span class="label">订单金额</span>
              <span class="value">¥{{ formatAmount(item.amount) }}</span>
            </div>
            <div class="stat-item">
              <span class="label">占比</span>
              <span class="value">{{ item.percentage }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表展示 -->
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

    <!-- 详细数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>分类详细数据</span>
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
        <el-table-column prop="avgAmount" label="平均金额">
          <template #default="{ row }">
            ¥{{ formatAmount(row.amount / row.count) }}
          </template>
        </el-table-column>
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

// 状态定义
const dateRange = ref([])
const categoryStats = ref([
  {
    type: '航拍任务',
    count: 156,
    amount: 78000,
    percentage: 35
  },
  {
    type: '测绘任务',
    count: 89,
    amount: 53400,
    percentage: 25
  },
  {
    type: '巡检任务',
    count: 67,
    amount: 40200,
    percentage: 20
  },
  {
    type: '其他任务',
    count: 45,
    amount: 27000,
    percentage: 20
  }
])

// 图表引用
const pieChartRef = ref(null)
const lineChartRef = ref(null)
let pieChart = null
let lineChart = null

// 初始化图表
const initCharts = () => {
  // 饼图配置
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
          data: categoryStats.value.map(item => ({
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

  // 折线图配置
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toLocaleDateString()
    }).reverse()
    
    lineChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: categoryStats.value.map(item => item.type)
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value'
      },
      series: categoryStats.value.map(category => ({
        name: category.type,
        type: 'line',
        smooth: true,
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50))
      }))
    })
  }
}

// 处理日期变化
const handleDateChange = () => {
  // 实现日期筛选逻辑
  loadData()
}

// 导出数据
const exportData = () => {
  try {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(categoryStats.value)
    XLSX.utils.book_append_sheet(wb, ws, '订单分类统计')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '订单分类统计.xlsx')
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
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
  if (pieChart) pieChart.dispose()
  if (lineChart) lineChart.dispose()
})

const handleResize = () => {
  if (pieChart) pieChart.resize()
  if (lineChart) lineChart.resize()
}
</script>

<style scoped>
.order-categories {
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
  padding: 10px 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-item .label {
  color: #909399;
}

.stat-item .value {
  font-weight: bold;
  color: #409EFF;
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