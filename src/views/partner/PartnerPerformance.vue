<template>
  <div class="app-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-title">
        <el-icon><TrendCharts /></el-icon>
        <h2>合作商业绩监控</h2>
      </div>
      <div class="header-btns">
        <el-button type="success" plain @click="handleAnalysis">
          <el-icon><DataAnalysis /></el-icon>业绩分析
        </el-button>
        <el-button type="warning" @click="handleExportData">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
        <el-button type="primary" @click="handleRefreshData">
          <el-icon><Refresh /></el-icon>刷新数据
        </el-button>
      </div>
    </div>

    <!-- 业绩概览卡片 -->
    <el-row :gutter="20" class="overview-section">
      <el-col :span="6" v-for="item in performanceOverview" :key="item.title">
        <el-card class="overview-card" shadow="hover">
          <div class="overview-content">
            <div class="overview-header">
              <div class="overview-icon" :class="item.type">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="overview-title">{{ item.title }}</div>
              <div class="overview-badge" v-if="item.badge">
                <el-tag :type="item.badge.type" size="small">{{ item.badge.text }}</el-tag>
              </div>
            </div>
            <div class="overview-value">{{ item.value }}</div>
            <div class="overview-chart">
              <div class="chart-label">{{ item.chart.label }}</div>
              <el-progress
                :percentage="item.chart.percentage"
                :color="item.chart.color"
                :stroke-width="4"
                :show-text="false"
              />
            </div>
            <div class="overview-trend" :class="getTrendClass(item.trend)">
              <span class="trend-value">{{ Math.abs(item.trend) }}%</span>
              <span class="trend-label">较上月</span>
              <el-icon>
                <CaretTop v-if="item.trend > 0" />
                <CaretBottom v-else />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主要内容区域 -->
    <el-row :gutter="20" class="main-content">
      <!-- 搜索栏 -->
      <el-col :span="24">
        <el-card class="search-card">
          <el-form :model="searchForm" inline class="search-form">
            <el-form-item label="合作商">
              <el-select 
                v-model="searchForm.partnerId" 
                placeholder="请选择合作商"
                clearable
                class="search-select"
              >
                <el-option
                  v-for="partner in partnerOptions"
                  :key="partner.id"
                  :label="partner.name"
                  :value="partner.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :shortcuts="dateShortcuts"
              />
            </el-form-item>
            <el-form-item label="订单类型">
              <el-select 
                v-model="searchForm.orderType" 
                placeholder="请选择订单类型"
                clearable
                class="search-select"
              >
                <el-option label="商品购买" value="purchase" />
                <el-option label="设备租赁" value="rental" />
                <el-option label="服务订单" value="service" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>查询
              </el-button>
              <el-button @click="resetSearch">
                <el-icon><Refresh /></el-icon>重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 销售趋势图表 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Histogram /></el-icon>
                销售趋势分析
              </span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="amount">销售额</el-radio-button>
                <el-radio-button label="count">订单量</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div ref="salesChartRef" style="width: 100%; height: 300px;"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 订单统计 -->
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Tickets /></el-icon>
                订单统计
              </span>
              <el-tag type="info" size="small">本月</el-tag>
            </div>
          </template>
          <div class="order-stats">
            <div class="pie-chart">
              <div ref="orderPieRef" style="width: 100%; height: 200px;"></div>
            </div>
            <div class="stats-list">
              <div class="stat-item" v-for="item in orderStats" :key="item.type">
                <div class="stat-info">
                  <span class="stat-label">{{ item.label }}</span>
                  <span class="stat-value" :class="item.type">{{ item.value }}</span>
                </div>
                <div class="stat-progress">
                  <el-progress 
                    :percentage="item.percentage" 
                    :color="item.color"
                    :show-text="false"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 业绩排名 -->
      <el-col :span="8">
        <el-card class="rank-card" :body-style="{ padding: '0' }">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Medal /></el-icon>
                业绩排名
              </span>
              <el-radio-group v-model="rankType" size="small">
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="quarter">本季度</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <el-scrollbar height="calc(100% - 52px)">
            <div class="rank-list">
              <div 
                v-for="(item, index) in performanceRanking" 
                :key="item.id"
                class="rank-item"
                :class="{ 'top-three': index < 3 }"
              >
                <div class="rank-index">
                  <el-icon v-if="index < 3"><Trophy /></el-icon>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="rank-info">
                  <div class="partner-name">{{ item.name }}</div>
                  <div class="partner-stats">
                    <span>销售额：¥{{ item.amount }}</span>
                    <span>订单量：{{ item.orders }}单</span>
                  </div>
                </div>
                <div class="rank-progress">
                  <el-progress 
                    :percentage="item.completion" 
                    :color="getRankColor(index)"
                  />
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>

      <!-- 订单列表 -->
      <el-col :span="24">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Document /></el-icon>
                订单明细
              </span>
            </div>
          </template>
          <el-table :data="orderList" border style="width: 100%">
            <el-table-column prop="orderNo" label="订单编号" width="180" />
            <el-table-column prop="type" label="订单类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getOrderTypeTag(row.type)">
                  {{ getOrderTypeLabel(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="订单金额" width="150">
              <template #default="{ row }">
                ¥{{ row.amount }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="completionTime" label="完成时间" width="180" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewOrder(row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'
import { 
  TrendCharts,
  DataAnalysis,
  Download,
  Refresh,
  Search,
  CaretTop,
  CaretBottom,
  Histogram,
  Tickets,
  Medal,
  Trophy,
  Document,
  Money,
  PriceTag,
  Warning
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 业绩概览数据
const performanceOverview = [
  {
    title: '本月销售额',
    value: '¥128,560',
    trend: 12.5,
    icon: 'Money',
    type: 'primary',
    badge: {
      type: 'success',
      text: '达标'
    },
    chart: {
      label: '目标完成率',
      percentage: 85,
      color: '#409EFF'
    }
  },
  {
    title: '订单总量',
    value: '1,286',
    trend: 8.3,
    icon: 'Tickets',
    type: 'success',
    badge: {
      type: 'primary',
      text: '良好'
    },
    chart: {
      label: '转化率',
      percentage: 65,
      color: '#67C23A'
    }
  },
  {
    title: '客单价',
    value: '¥99.9',
    trend: -5.2,
    icon: 'PriceTag',
    type: 'warning',
    badge: {
      type: 'warning',
      text: '需提升'
    },
    chart: {
      label: '环比变化',
      percentage: 45,
      color: '#E6A23C'
    }
  },
  {
    title: '退单率',
    value: '2.5%',
    trend: -15.6,
    icon: 'Warning',
    type: 'info',
    badge: {
      type: 'success',
      text: '良好'
    },
    chart: {
      label: '控制目标',
      percentage: 25,
      color: '#909399'
    }
  }
]

// 搜索表单
const searchForm = reactive({
  partnerId: '',
  dateRange: [],
  orderType: ''
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
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 图表相关
const salesChartRef = ref(null)
const orderPieRef = ref(null)
const chartType = ref('amount')
const rankType = ref('month')

// 初始化销售趋势图表
const initSalesChart = () => {
  const chart = echarts.init(salesChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['销售额', '订单量']
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
        name: '销售额',
        type: 'line',
        smooth: true,
        data: [12000, 13200, 10100, 13400, 19000, 23400, 14500]
      },
      {
        name: '订单量',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 190, 230, 145]
      }
    ]
  }
  chart.setOption(option)
}

// 初始化订单类型饼图
const initOrderPieChart = () => {
  const chart = echarts.init(orderPieRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '订单类型',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 735, name: '商品购买' },
          { value: 580, name: '设备租赁' },
          { value: 484, name: '服务订单' }
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
  }
  chart.setOption(option)
}

// 订单统计数据
const orderStats = [
  {
    type: 'purchase',
    label: '商品购买',
    value: '735',
    percentage: 75,
    color: '#409EFF'
  },
  {
    type: 'rental',
    label: '设备租赁',
    value: '580',
    percentage: 58,
    color: '#67C23A'
  },
  {
    type: 'service',
    label: '服务订单',
    value: '484',
    percentage: 48,
    color: '#E6A23C'
  }
]

// 业绩排名数据
const performanceRanking = [
  {
    id: 1,
    name: '北京合作商A',
    amount: '256,890',
    orders: 1245,
    completion: 95
  },
  {
    id: 2,
    name: '上海合作商B',
    amount: '198,560',
    orders: 986,
    completion: 88
  },
  {
    id: 3,
    name: '广州合作商C',
    amount: '156,730',
    orders: 876,
    completion: 82
  },
  {
    id: 4,
    name: '深圳合作商D',
    amount: '143,450',
    orders: 765,
    completion: 76
  },
  {
    id: 5,
    name: '杭州合作商E',
    amount: '132,680',
    orders: 654,
    completion: 70
  }
]

// 获取排名颜色
const getRankColor = (index) => {
  const colors = ['#f7b500', '#8544ea', '#0089ff', '#409EFF']
  return colors[index] || '#409EFF'
}

// 订单类型标签
const getOrderTypeTag = (type) => {
  const types = {
    purchase: 'primary',
    rental: 'success',
    service: 'warning'
  }
  return types[type] || 'info'
}

// 订单状态标签
const getStatusType = (status) => {
  const types = {
    pending: 'info',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

// 获取趋势样式类
const getTrendClass = (trend) => {
  if (trend > 0) {
    return 'up'
  } else if (trend < 0) {
    return 'down'
  } else {
    return 'stable'
  }
}

// 页面加载时初始化图表
onMounted(() => {
  initSalesChart()
  initOrderPieChart()
  
  // 监听窗口大小变化，重绘图表
  window.addEventListener('resize', () => {
    const salesChart = echarts.getInstanceByDom(salesChartRef.value)
    const orderPie = echarts.getInstanceByDom(orderPieRef.value)
    salesChart?.resize()
    orderPie?.resize()
  })
})

// 处理搜索
const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索条件：', searchForm)
}

// 重置搜索
const resetSearch = () => {
  searchForm.partnerId = ''
  searchForm.dateRange = []
  searchForm.orderType = ''
}

// 其他事件处理方法
const handleAnalysis = () => {
  ElMessage.success('正在生成分析报告...')
}

const handleExportData = () => {
  ElMessage.success('正在导出数据...')
}

const handleRefreshData = () => {
  ElMessage.success('数据已更新')
}

const handleViewOrder = (row) => {
  console.log('查看订单：', row)
}
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .el-icon {
    font-size: 24px;
    color: #409EFF;
  }
  
  h2 {
    margin: 0;
    font-size: 20px;
  }
}

.overview-section {
  margin-bottom: 20px;
}

.overview-card {
  padding: 20px;
  background: #ffffff;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.overview-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.primary {
    background: linear-gradient(135deg, rgba(64,158,255,0.1) 0%, rgba(64,158,255,0.2) 100%);
    color: #409EFF;
  }
  
  &.success {
    background: linear-gradient(135deg, rgba(103,194,58,0.1) 0%, rgba(103,194,58,0.2) 100%);
    color: #67C23A;
  }
  
  &.warning {
    background: linear-gradient(135deg, rgba(230,162,60,0.1) 0%, rgba(230,162,60,0.2) 100%);
    color: #E6A23C;
  }
  
  &.info {
    background: linear-gradient(135deg, rgba(144,147,153,0.1) 0%, rgba(144,147,153,0.2) 100%);
    color: #909399;
  }
}

.overview-badge {
  position: absolute;
  right: 0;
  top: 0;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  margin: 12px 0;
}

.overview-chart {
  margin: 16px 0;
}

.chart-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.main-content {
  .el-col {
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  
  .el-icon {
    font-size: 16px;
  }
}

.rank-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.rank-list {
  padding: 16px;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f2f5;
  }
  
  &.top-three {
    background: #fef9e7;
    
    &:hover {
      background: #fdf6d4;
    }
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.rank-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-weight: bold;
  
  .el-icon {
    font-size: 18px;
    color: #f7b500;
  }
}

.rank-info {
  flex: 1;
  margin-right: 12px;
}

.partner-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.partner-stats {
  font-size: 13px;
  color: #909399;
  
  span {
    margin-right: 12px;
  }
}

.rank-progress {
  width: 120px;
  :deep(.el-progress-bar__outer) {
    background-color: rgba(0,0,0,0.04);
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.overview-trend {
  display: flex;
  align-items: center;
  font-size: 13px;
  
  &.up {
    color: #67C23A;
  }
  
  &.down {
    color: #F56C6C;
  }
  
  &.stable {
    color: #909399;
  }
}

.chart-card,
.stat-card,
.rank-card {
  height: 100%;
  min-height: 420px;
  display: flex;
  flex-direction: column;
}

.chart-container {
  height: calc(100% - 52px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-stats {
  height: calc(100% - 52px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.pie-chart {
  height: 200px;
  margin-bottom: 20px;
}

.rank-list {
  padding: 16px;
  height: calc(100% - 52px);
  overflow-y: auto;
}
</style>