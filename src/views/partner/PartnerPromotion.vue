<template>
  <div class="app-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-title">
        <el-icon><Promotion /></el-icon>
        <h2>推广活动监控</h2>
      </div>
      <div class="header-btns">
        <el-button type="success" plain @click="handleAnalysis">
          <el-icon><DataAnalysis /></el-icon>效果分析
        </el-button>
        <el-button type="warning" @click="handleExportData">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
        <el-button type="primary" @click="handleRefreshData">
          <el-icon><Refresh /></el-icon>刷新数据
        </el-button>
      </div>
    </div>

    <!-- 活动概览卡片 -->
    <el-row :gutter="20" class="overview-section">
      <el-col :span="6" v-for="item in promotionOverview" :key="item.title">
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
            <div class="overview-details">
              <div class="detail-group">
                <div class="detail-item">
                  <div class="detail-icon" :class="item.detail1.type">
                    <el-icon><component :is="item.detail1.icon" /></el-icon>
                  </div>
                  <div class="detail-content">
                    <div class="detail-label">{{ item.detail1.label }}</div>
                    <div class="detail-value" :class="item.detail1.type">{{ item.detail1.value }}</div>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-icon" :class="item.detail2.type">
                    <el-icon><component :is="item.detail2.icon" /></el-icon>
                  </div>
                  <div class="detail-content">
                    <div class="detail-label">{{ item.detail2.label }}</div>
                    <div class="detail-value" :class="item.detail2.type">{{ item.detail2.value }}</div>
                  </div>
                </div>
              </div>
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
                class="form-select"
              >
                <el-option
                  v-for="partner in partnerOptions"
                  :key="partner.id"
                  :label="partner.name"
                  :value="partner.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动状态">
              <el-select 
                v-model="searchForm.status" 
                placeholder="请选择活动状态"
                clearable
                class="form-select"
              >
                <el-option label="进行中" value="active" />
                <el-option label="已结束" value="ended" />
                <el-option label="未开始" value="pending" />
              </el-select>
            </el-form-item>
            <el-form-item label="活动类型">
              <el-select 
                v-model="searchForm.type" 
                placeholder="请选择活动类型"
                clearable
                class="form-select"
              >
                <el-option label="满减活动" value="discount" />
                <el-option label="新客优惠" value="newUser" />
                <el-option label="限时特惠" value="flash" />
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

      <!-- 活动效果分析 -->
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><TrendCharts /></el-icon>
                活动效果趋势
              </span>
              <el-radio-group v-model="chartMetric" size="small">
                <el-radio-button label="sales">销售额</el-radio-button>
                <el-radio-button label="customers">新客数</el-radio-button>
                <el-radio-button label="conversion">转化率</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div ref="effectChartRef" style="width: 100%; height: 350px;"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 活动排行 -->
      <el-col :span="8">
        <el-card class="rank-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Medal /></el-icon>
                活动效果排行
              </span>
              <el-tag type="info" size="small">本月</el-tag>
            </div>
          </template>
          <div class="rank-list">
            <div 
              v-for="(item, index) in activityRanking" 
              :key="item.id"
              class="rank-item"
            >
              <div class="rank-index">{{ index + 1 }}</div>
              <div class="rank-info">
                <div class="activity-name">{{ item.name }}</div>
                <div class="activity-stats">
                  <el-tag size="small" :type="getActivityType(item.type)">
                    {{ item.type }}
                  </el-tag>
                  <span>销售额：¥{{ item.sales }}</span>
                  <span>转化率：{{ item.conversion }}%</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 活动列表 -->
      <el-col :span="24">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><List /></el-icon>
                活动明细
              </span>
            </div>
          </template>
          <el-table :data="activityList" border style="width: 100%">
            <el-table-column prop="name" label="活动名称" min-width="180" />
            <el-table-column prop="type" label="活动类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getActivityType(row.type)">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="160" />
            <el-table-column prop="endTime" label="结束时间" width="160" />
            <el-table-column prop="status" label="活动状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="participants" label="参与人数" width="120" />
            <el-table-column prop="sales" label="销售额" width="150">
              <template #default="{ row }">
                ¥{{ row.sales }}
              </template>
            </el-table-column>
            <el-table-column prop="conversion" label="转化率" width="120">
              <template #default="{ row }">
                {{ row.conversion }}%
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewDetail(row)">
                  查看详情
                </el-button>
                <el-button link type="primary" @click="handleAnalyzeEffect(row)">
                  效果分析
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

    <!-- 活动详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="活动详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动名称" :span="2">{{ currentActivity?.name }}</el-descriptions-item>
        <el-descriptions-item label="活动类型">
          <el-tag :type="getActivityType(currentActivity?.type)">{{ currentActivity?.type }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="活动状态">
          <el-tag :type="getStatusType(currentActivity?.status)">
            {{ getStatusLabel(currentActivity?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentActivity?.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentActivity?.endTime }}</el-descriptions-item>
        <el-descriptions-item label="参与人数">{{ currentActivity?.participants }}人</el-descriptions-item>
        <el-descriptions-item label="销售额">¥{{ currentActivity?.sales }}</el-descriptions-item>
        <el-descriptions-item label="活动规则" :span="2">
          <div class="rule-content">
            <p v-for="(rule, index) in currentActivity?.rules" :key="index">{{ index + 1 }}. {{ rule }}</p>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 效果分析弹窗 -->
    <el-dialog
      v-model="analysisDialogVisible"
      title="活动效果分析"
      width="900px"
      class="analysis-dialog"
    >
      <el-tabs v-model="analysisTab" @tab-change="handleTabChange">
        <el-tab-pane label="数据概览" name="overview">
          <div class="analysis-overview">
            <el-row :gutter="20">
              <el-col :span="8" v-for="item in analysisMetrics" :key="item.label">
                <div class="metric-card">
                  <div class="metric-label">{{ item.label }}</div>
                  <div class="metric-value" :class="item.type">{{ item.value }}</div>
                  <div class="metric-trend" :class="item.trend > 0 ? 'up' : 'down'">
                    {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}% 较同期
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="转化漏斗" name="funnel">
          <div class="funnel-container">
            <div ref="funnelChartRef" class="funnel-chart"></div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="用户分析" name="user">
          <div class="user-analysis">
            <el-row :gutter="20">
              <el-col :span="12">
                <h4>用户属性分布</h4>
                <div class="chart-box">
                  <div ref="userPieRef" style="width: 100%; height: 300px;"></div>
                </div>
              </el-col>
              <el-col :span="12">
                <h4>参与频次分布</h4>
                <div class="chart-box">
                  <div ref="frequencyBarRef" style="width: 100%; height: 300px;"></div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { 
  Promotion,
  DataAnalysis,
  Download,
  Refresh,
  Search,
  TrendCharts,
  Medal,
  List,
  Timer,
  User,
  Wallet,
  ShoppingCart
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 活动概览数据
const promotionOverview = [
  {
    title: '进行中活动',
    value: '12',
    icon: 'Timer',
    type: 'primary',
    badge: {
      type: 'success',
      text: '正常'
    },
    detail1: {
      label: '满减活动',
      value: '5个',
      type: 'primary',
      icon: 'Wallet'
    },
    detail2: {
      label: '特惠活动',
      value: '7个',
      type: 'info',
      icon: 'ShoppingCart'
    }
  },
  {
    title: '本月销售额',
    value: '¥89,560',
    icon: 'Money',
    type: 'success',
    badge: {
      type: 'primary',
      text: '达标'
    },
    detail1: {
      label: '活动销售',
      value: '¥56,890',
      type: 'success',
      icon: 'Wallet'
    },
    detail2: {
      label: '常规销售',
      value: '¥32,670',
      type: 'info',
      icon: 'ShoppingCart'
    }
  },
  {
    title: '新增客户',
    value: '1,286',
    icon: 'User',
    type: 'warning',
    badge: {
      type: 'warning',
      text: '需提升'
    },
    detail1: {
      label: '活动获客',
      value: '856人',
      type: 'warning',
      icon: 'User'
    },
    detail2: {
      label: '自然获客',
      value: '430人',
      type: 'info',
      icon: 'User'
    }
  },
  {
    title: '平均转化率',
    value: '32.5%',
    icon: 'TrendCharts',
    type: 'info',
    badge: {
      type: 'success',
      text: '良好'
    },
    detail1: {
      label: '活动转化',
      value: '45.8%',
      type: 'success',
      icon: 'TrendCharts'
    },
    detail2: {
      label: '常规转化',
      value: '28.3%',
      type: 'info',
      icon: 'TrendCharts'
    }
  }
]

// 搜索表单
const searchForm = reactive({
  partnerId: '',
  status: '',
  type: ''
})

// 图表相关
const effectChartRef = ref(null)
const chartMetric = ref('sales')

// 初始化效果趋势图表
const initEffectChart = () => {
  const chart = echarts.init(effectChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['活动期间', '活动前']
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
        name: '活动期间',
        type: 'line',
        smooth: true,
        data: [15000, 18000, 22000, 25000, 28000, 32000, 35000],
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '活动前',
        type: 'line',
        smooth: true,
        data: [12000, 13000, 15000, 14000, 16000, 18000, 17000],
        itemStyle: {
          color: '#909399'
        }
      }
    ]
  }
  chart.setOption(option)
}

// 活动排行数据
const activityRanking = [
  {
    id: 1,
    name: '618大促活动',
    type: '满减活动',
    sales: '156,890',
    conversion: 45.8
  },
  {
    id: 2,
    name: '新客特惠',
    type: '新客优惠',
    sales: '89,560',
    conversion: 38.5
  },
  {
    id: 3,
    name: '周末闪购',
    type: '限时特惠',
    sales: '56,730',
    conversion: 32.6
  }
]

// 获取活动类型标签样式
const getActivityType = (type) => {
  const types = {
    '满减活动': 'primary',
    '新客优惠': 'success',
    '限时特惠': 'warning'
  }
  return types[type] || 'info'
}

// 获取状态标签样式
const getStatusType = (status) => {
  const types = {
    active: 'success',
    ended: 'info',
    pending: 'warning'
  }
  return types[status] || 'info'
}

// 获取状态标签文本
const getStatusLabel = (status) => {
  const labels = {
    active: '进行中',
    ended: '已结束',
    pending: '未开始'
  }
  return labels[status] || status
}

// 页面加载时初始化图表
onMounted(() => {
  initEffectChart()
  
  // 监听窗口大小变化，重绘图表
  window.addEventListener('resize', () => {
    const effectChart = echarts.getInstanceByDom(effectChartRef.value)
    effectChart?.resize()
  })
})

// 处理搜索
const handleSearch = () => {
  console.log('搜索条件：', searchForm)
}

// 重置搜索
const resetSearch = () => {
  searchForm.partnerId = ''
  searchForm.status = ''
  searchForm.type = ''
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

// 详情弹窗相关
const detailDialogVisible = ref(false)
const currentActivity = ref(null)

// 效果分析弹窗相关
const analysisDialogVisible = ref(false)
const analysisTab = ref('overview')
const funnelChartRef = ref(null)
const userPieRef = ref(null)
const frequencyBarRef = ref(null)

// 分析指标数据
const analysisMetrics = ref([
  {
    label: '活动投入产出比',
    value: '3.5',
    trend: 15.2,
    type: 'success'
  },
  {
    label: '客单价',
    value: '¥125',
    trend: 8.5,
    type: 'primary'
  },
  {
    label: '新客占比',
    value: '45.8%',
    trend: -2.3,
    type: 'warning'
  }
])

// 分析效果
const handleAnalyzeEffect = (row) => {
  currentActivity.value = row
  analysisDialogVisible.value = true
  nextTick(() => {
    // 等待弹窗动画完成后初始化图表
    setTimeout(() => {
      initFunnelChart()
      // 如果当前是用户分析标签页，则初始化用户分析相关图表
      if (analysisTab.value === 'user') {
        initUserPieChart()
        initFrequencyBarChart()
      }
    }, 300)  // 增加延时确保DOM已完全渲染
  })
}

// 监听标签页切换
const handleTabChange = (tab) => {
  // 清除旧的图表实例
  const charts = {
    funnel: funnelChartRef.value,
    user: [userPieRef.value, frequencyBarRef.value]
  }
  
  const oldChart = echarts.getInstanceByDom(charts[tab === 'user' ? 'funnel' : 'user'])
  oldChart?.dispose()

  nextTick(() => {
    setTimeout(() => {
      // 根据当前标签页重新初始化对应的图表
      if (tab === 'funnel') {
        initFunnelChart()
      } else if (tab === 'user') {
        initUserPieChart()
        initFrequencyBarChart()
      }
    }, 100)
  })
}

// 初始化转化漏斗图表
const initFunnelChart = () => {
  if (!funnelChartRef.value) return
  
  // 清除已存在的图表实例
  const existingChart = echarts.getInstanceByDom(funnelChartRef.value)
  if (existingChart) {
    existingChart.dispose()
  }
  
  // 设置容器样式
  funnelChartRef.value.style.width = '100%'
  funnelChartRef.value.style.height = '400px'
  
  const chart = echarts.init(funnelChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)'
    },
    title: {
      text: '用户转化漏斗',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    series: [
      {
        name: '转化漏斗',
        type: 'funnel',
        left: '15%',
        right: '15%',
        top: 60,
        bottom: 60,
        width: '70%',
        height: '85%',
        min: 0,
        max: 100,
        sort: 'descending',
        gap: 8,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}\n转化率: {c}%',
          fontSize: 14,
          color: '#606266',
          distance: 15
        },
        itemStyle: {
          opacity: 0.9,
          borderWidth: 2,
          borderColor: '#fff'
        },
        emphasis: {
          label: {
            fontSize: 16
          }
        },
        data: [
          { 
            value: 100, 
            name: '浏览人数',
            itemStyle: { color: '#409EFF', borderRadius: 4 }
          },
          { 
            value: 80, 
            name: '点击人数',
            itemStyle: { color: '#67C23A', borderRadius: 4 }
          },
          { 
            value: 60, 
            name: '加购人数',
            itemStyle: { color: '#E6A23C', borderRadius: 4 }
          },
          { 
            value: 40, 
            name: '下单人数',
            itemStyle: { color: '#F56C6C', borderRadius: 4 }
          },
          { 
            value: 20, 
            name: '支付人数',
            itemStyle: { color: '#909399', borderRadius: 4 }
          }
        ]
      }
    ]
  }
  chart.setOption(option)
  
  // 强制重绘一次
  chart.resize()
}

// 初始化用户属性饼图
const initUserPieChart = () => {
  const chart = echarts.init(userPieRef.value)
  const option = {
    title: {
      text: '用户属性分布',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        color: '#606266',
        fontSize: 12
      }
    },
    series: [
      {
        name: '用户属性',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#606266',
          fontSize: 12
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          smooth: true
        },
        data: [
          { 
            value: 45, 
            name: '新客户',
            itemStyle: { color: '#409EFF' }
          },
          { 
            value: 25, 
            name: '普通会员',
            itemStyle: { color: '#67C23A' }
          },
          { 
            value: 20, 
            name: '高级会员',
            itemStyle: { color: '#E6A23C' }
          },
          { 
            value: 10, 
            name: 'VIP会员',
            itemStyle: { color: '#F56C6C' }
          }
        ]
      }
    ]
  }
  chart.setOption(option)
}

// 初始化频次分布柱状图
const initFrequencyBarChart = () => {
  const chart = echarts.init(frequencyBarRef.value)
  const option = {
    title: {
      text: '参与频次分布',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1次', '2次', '3次', '4次', '5次以上'],
      axisLabel: {
        interval: 0,
        color: '#606266'
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      name: '人数',
      nameTextStyle: {
        color: '#606266'
      },
      axisLabel: {
        color: '#606266'
      },
      splitLine: {
        lineStyle: {
          color: '#ebeef5'
        }
      }
    },
    series: [
      {
        data: [320, 240, 150, 80, 40],
        type: 'bar',
        barWidth: '30%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#409EFF' },
            { offset: 1, color: '#188df0' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#66b1ff' },
              { offset: 0.7, color: '#409EFF' },
              { offset: 1, color: '#3a8ee6' }
            ])
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

// 查看详情
const handleViewDetail = (row) => {
  currentActivity.value = row
  detailDialogVisible.value = true
}

// 监听弹窗关闭
watch(analysisDialogVisible, (val) => {
  if (!val) {
    // 清除图表实例，避免内存泄漏
    const charts = [funnelChartRef.value, userPieRef.value, frequencyBarRef.value]
    charts.forEach(chart => {
      const instance = echarts.getInstanceByDom(chart)
      instance?.dispose()
    })
  }
})

// 监听弹窗打开
watch(() => analysisDialogVisible.value, (val) => {
  if (val) {
    // 弹窗打开后重新初始化当前标签页的图表
    nextTick(() => {
      setTimeout(() => {
        if (analysisTab.value === 'funnel') {
          initFunnelChart()
        } else if (analysisTab.value === 'user') {
          initUserPieChart()
          initFrequencyBarChart()
        }
      }, 300)
    })
  }
}, { immediate: false })

// 监听窗口大小变化
window.addEventListener('resize', () => {
  const charts = [funnelChartRef.value, userPieRef.value, frequencyBarRef.value]
  charts.forEach(chart => {
    const instance = echarts.getInstanceByDom(chart)
    instance?.resize()
  })
})

// 活动列表数据
const activityList = [
  {
    id: 1,
    name: '618大促活动',
    type: '满减活动',
    startTime: '2024-06-01 00:00:00',
    endTime: '2024-06-18 23:59:59',
    status: 'active',
    participants: 1256,
    sales: '156,890',
    conversion: 45.8
  },
  {
    id: 2,
    name: '新客特惠周',
    type: '新客优惠',
    startTime: '2024-05-15 00:00:00',
    endTime: '2024-05-21 23:59:59',
    status: 'ended',
    participants: 856,
    sales: '89,560',
    conversion: 38.5
  },
  {
    id: 3,
    name: '周末闪购特惠',
    type: '限时特惠',
    startTime: '2024-06-24 00:00:00',
    endTime: '2024-06-25 23:59:59',
    status: 'pending',
    participants: 0,
    sales: '0',
    conversion: 0
  },
  {
    id: 4,
    name: '五一假期大促',
    type: '满减活动',
    startTime: '2024-05-01 00:00:00',
    endTime: '2024-05-05 23:59:59',
    status: 'ended',
    participants: 2156,
    sales: '256,780',
    conversion: 42.6
  },
  {
    id: 5,
    name: '会员专享日',
    type: '限时特惠',
    startTime: '2024-06-15 00:00:00',
    endTime: '2024-06-15 23:59:59',
    status: 'active',
    participants: 568,
    sales: '68,920',
    conversion: 35.8
  }
]
</script>

<style scoped>
/* 复用之前的基础样式 */
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

.detail-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.detail-content {
  flex: 1;
}

.detail-label {
  color: #909399;
  font-size: 13px;
}

.detail-value {
  font-weight: 500;
  margin-top: 2px;
  
  &.primary {
    color: #409EFF;
  }
  
  &.success {
    color: #67C23A;
  }
  
  &.warning {
    color: #E6A23C;
  }
  
  &.info {
    color: #909399;
  }
}

.search-form {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  
  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 0;
  }
  
  :deep(.el-form-item__label) {
    font-weight: normal;
    padding-right: 8px;
  }
}

.form-select {
  width: 180px;
}

.chart-card,
.rank-card {
  height: 100%;
  min-height: 420px;
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
  background: #f0f2f5;
  border-radius: 50%;
}

.rank-info {
  flex: 1;
}

.activity-name {
  font-weight: 500;
  margin-bottom: 8px;
}

.activity-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #909399;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.analysis-overview {
  padding: 20px 0;
}

.metric-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.metric-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  
  &.success {
    color: #67C23A;
  }
  
  &.primary {
    color: #409EFF;
  }
  
  &.warning {
    color: #E6A23C;
  }
}

.metric-trend {
  font-size: 13px;
  
  &.up {
    color: #67C23A;
  }
  
  &.down {
    color: #F56C6C;
  }
}

.user-analysis {
  h4 {
    margin: 0 0 20px;
    color: #303133;
  }
}

.rule-content {
  line-height: 1.8;
  color: #606266;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

.analysis-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
    overflow: hidden;
  }

  :deep(.el-tabs__content) {
    overflow: hidden;
  }
  
  :deep(.el-tab-pane) {
    padding: 10px 0;
  }
}

.funnel-container {
  width: 100%;
  height: 400px;
  position: relative;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.funnel-chart {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  top: 0;
  left: 0;
}

.chart-box {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.user-analysis {
  width: 100%;
  
  :deep(.el-row) {
    width: 100%;
    margin: 0 !important;
  }
  
  .el-col {
    padding: 0 10px;
    box-sizing: border-box;
  }
}
</style> 