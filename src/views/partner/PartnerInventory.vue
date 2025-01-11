<template>
  <div class="app-container">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-title">
        <el-icon><Box /></el-icon>
        <h2>库存管理监控</h2>
      </div>
      <div class="header-btns">
        <el-button type="success" plain @click="handleAnalysis">
          <el-icon><DataLine /></el-icon>库存分析
        </el-button>
        <el-button type="warning" @click="handleExportData">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
        <el-button type="primary" @click="handleRefreshData">
          <el-icon><Refresh /></el-icon>刷新数据
        </el-button>
      </div>
    </div>

    <!-- 库存概览卡片 -->
    <el-row :gutter="20" class="overview-section">
      <el-col :span="6" v-for="item in overviewData" :key="item.title">
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
            <div class="overview-chart">
              <div class="chart-label">{{ item.chart?.label }}</div>
              <el-progress
                :percentage="item.chart?.percentage"
                :color="item.chart?.color"
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
            <el-form-item label="商品类型">
              <el-select 
                v-model="searchForm.type" 
                placeholder="请选择商品类型"
                clearable
                class="search-select"
              >
                <el-option label="设备" value="equipment" />
                <el-option label="配件" value="parts" />
                <el-option label="耗材" value="consumables" />
              </el-select>
            </el-form-item>
            <el-form-item label="库存状态">
              <el-select 
                v-model="searchForm.status" 
                placeholder="请选择库存状态"
                clearable
                class="search-select"
              >
                <el-option label="正常" value="normal" />
                <el-option label="积压" value="overstock" />
                <el-option label="短缺" value="shortage" />
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

      <!-- 库存列表 -->
      <el-col :span="24">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span>库存明细</span>
              <el-radio-group v-model="viewType" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="warning">预警</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="商品名称" min-width="150" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getTypeTagType(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="当前库存" width="100" />
            <el-table-column prop="minStock" label="最低库存" width="100" />
            <el-table-column prop="maxStock" label="最高库存" width="100" />
            <el-table-column prop="turnoverRate" label="周转率" width="120">
              <template #default="{ row }">
                <span :class="getTurnoverClass(row.turnoverRate)">{{ row.turnoverRate }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="location" label="库存位置" min-width="150" show-overflow-tooltip />
            <el-table-column prop="lastUpdate" label="最后更新" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewHistory(row)">变动记录</el-button>
                <el-button link type="primary" @click="handleSupplyRequest(row)">补货申请</el-button>
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

      <!-- 统计信息行 -->
      <el-col :span="24">
        <el-row :gutter="20">
          <!-- 库存分布 -->
          <el-col :span="8">
            <el-card class="stat-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">
                    <el-icon><PieChart /></el-icon>
                    库存分布
                  </span>
                  <el-radio-group v-model="distributionType" size="small">
                    <el-radio-button label="type">类型</el-radio-button>
                    <el-radio-button label="status">状态</el-radio-button>
                  </el-radio-group>
                </div>
              </template>
              <div class="chart-container">
                <el-progress
                  v-for="item in distributionData"
                  :key="item.label"
                  :percentage="item.percentage"
                  :color="item.color"
                  :stroke-width="15"
                  :show-text="false"
                  class="distribution-progress"
                >
                  <template #default>
                    <div class="progress-label">
                      <span>{{ item.label }}</span>
                      <span>{{ item.value }}件 ({{ item.percentage }}%)</span>
                    </div>
                  </template>
                </el-progress>
              </div>
            </el-card>
          </el-col>
          <!-- 预警信息 -->
          <el-col :span="8">
            <el-card class="stat-card warning-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">
                    <el-icon><Warning /></el-icon>
                    预警信息
                  </span>
                  <el-tag type="danger" size="small">{{ warningList.length }}条</el-tag>
                </div>
              </template>
              <el-scrollbar height="200px">
                <div class="warning-list">
                  <div 
                    v-for="(item, index) in warningList" 
                    :key="index"
                    class="warning-item"
                  >
                    <el-icon :class="item.type"><Warning /></el-icon>
                    <div class="warning-content">
                      <div class="warning-title">{{ item.title }}</div>
                      <div class="warning-desc">{{ item.description }}</div>
                      <div class="warning-time">{{ item.time }}</div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </el-card>
          </el-col>
          <!-- 补货申请统计 -->
          <el-col :span="8">
            <el-card class="stat-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>补货申请统计</span>
                  <el-tag type="info" size="small">本月</el-tag>
                </div>
              </template>
              <div class="supply-stats">
                <div class="stat-item">
                  <div class="stat-label">申请总数</div>
                  <div class="stat-value">156</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">已处理</div>
                  <div class="stat-value success">142</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">处理中</div>
                  <div class="stat-value warning">14</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">平均处理时间</div>
                  <div class="stat-value">2.5天</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 补货申请对话框 -->
    <el-dialog
      title="补货申请处理"
      v-model="supplyDialogVisible"
      width="600px"
    >
      <el-form
        ref="supplyFormRef"
        :model="supplyForm"
        :rules="supplyFormRules"
        label-width="100px"
      >
        <el-form-item label="商品名称">
          <span>{{ supplyForm.name }}</span>
        </el-form-item>
        <el-form-item label="当前库存">
          <span>{{ supplyForm.currentStock }}</span>
        </el-form-item>
        <el-form-item label="申请数量" prop="requestAmount">
          <el-input-number 
            v-model="supplyForm.requestAmount"
            :min="1"
            :step="1"
          />
        </el-form-item>
        <el-form-item label="期望到货日" prop="expectedDate">
          <el-date-picker
            v-model="supplyForm.expectedDate"
            type="date"
            placeholder="选择期望到货日期"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="申请说明" prop="reason">
          <el-input
            type="textarea"
            v-model="supplyForm.reason"
            rows="3"
            placeholder="请输入申请说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="supplyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSupplySubmit">提交申请</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 变动记录对话框 -->
    <el-dialog
      title="库存变动记录"
      v-model="historyDialogVisible"
      width="800px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(history, index) in stockHistory"
          :key="index"
          :type="history.type"
          :timestamp="history.time"
          :color="getHistoryColor(history.type)"
        >
          <h4>{{ history.title }}</h4>
          <p>{{ history.content }}</p>
          <p class="history-detail">
            <span>变动数量：{{ history.amount > 0 ? '+' : '' }}{{ history.amount }}</span>
            <span>操作人：{{ history.operator }}</span>
          </p>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>

</template>

<script setup>
import { ref, reactive } from 'vue'
import { 
  Search, 
  Refresh, 
  Download,
  CaretTop,
  CaretBottom,
  Box,
  TrendCharts,
  Warning,
  Van,
  DataLine,
  PieChart,
  Goods,
  Tools,
  Timer,
  Odometer,
  Bell,
  Document
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 概览数据
const overviewData = [
  {
    title: '总库存量',
    value: '2,356',
    trend: 12.5,
    icon: 'Box',
    type: 'primary',
    badge: {
      type: 'success',
      text: '库存充足'
    },
    detail1: {
      label: '设备库存',
      value: '1,245件',
      type: 'primary',
      icon: 'Goods'
    },
    detail2: {
      label: '配件库存',
      value: '1,111件',
      type: 'info',
      icon: 'Tools'
    },
    chart: {
      label: '库存使用率',
      percentage: 75,
      color: '#409EFF'
    }
  },
  {
    title: '周转率',
    value: '45.8%',
    trend: 8.3,
    icon: 'TrendCharts',
    type: 'success',
    badge: {
      type: 'primary',
      text: '运转良好'
    },
    detail1: {
      label: '平均周期',
      value: '15天',
      type: 'success',
      icon: 'Timer'
    },
    detail2: {
      label: '出库频率',
      value: '32次/天',
      type: 'warning',
      icon: 'Odometer'
    },
    chart: {
      label: '周转效率',
      percentage: 45.8,
      color: '#67C23A'
    }
  },
  {
    title: '预警商品',
    value: '15',
    trend: -5.2,
    icon: 'Warning',
    type: 'warning',
    badge: {
      type: 'danger',
      text: '需要关注'
    },
    detail1: {
      label: '库存积压',
      value: '8件',
      type: 'warning',
      icon: 'Bell'
    },
    detail2: {
      label: '库存短缺',
      value: '7件',
      type: 'danger',
      icon: 'Warning'
    },
    chart: {
      label: '预警处理进度',
      percentage: 35,
      color: '#E6A23C'
    }
  },
  {
    title: '待处理补货',
    value: '8',
    trend: 15.6,
    icon: 'Van',
    type: 'info',
    badge: {
      type: 'warning',
      text: '待处理'
    },
    detail1: {
      label: '加急补货',
      value: '3件',
      type: 'danger',
      icon: 'Document'
    },
    detail2: {
      label: '常规补货',
      value: '5件',
      type: 'info',
      icon: 'Van'
    },
    chart: {
      label: '处理进度',
      percentage: 65,
      color: '#909399'
    }
  }
]

// 合作商选项
const partnerOptions = [
  { id: 1, name: '北京合作商A' },
  { id: 2, name: '上海合作商B' },
  { id: 3, name: '广州合作商C' }
]

// 搜索表单
const searchForm = reactive({
  partnerId: '',
  type: '',
  status: ''
})

// 视图类型
const viewType = ref('all')

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '无人机 A-001',
    type: 'equipment',
    stock: 25,
    minStock: 10,
    maxStock: 50,
    turnoverRate: 35.6,
    status: 'normal',
    location: '北京仓库-A区-01架',
    lastUpdate: '2024-03-15 14:30:00'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 补货对话框相关
const supplyDialogVisible = ref(false)
const supplyFormRef = ref(null)
const supplyForm = reactive({
  name: '',
  currentStock: 0,
  requestAmount: 1,
  expectedDate: '',
  reason: ''
})

// 变动记录对话框相关
const historyDialogVisible = ref(false)
const stockHistory = ref([
  {
    time: '2024-03-15 14:30:00',
    type: 'success',
    title: '入库',
    content: '常规补货入库',
    amount: 50,
    operator: '张三'
  },
  {
    time: '2024-03-14 16:20:00',
    type: 'warning',
    title: '出库',
    content: '订单发货出库',
    amount: -20,
    operator: '李四'
  }
])

// 表单校验规则
const supplyFormRules = {
  requestAmount: [{ required: true, message: '请输入申请数量', trigger: 'blur' }],
  expectedDate: [{ required: true, message: '请选择期望到货日期', trigger: 'change' }],
  reason: [{ required: true, message: '请输入申请说明', trigger: 'blur' }]
}

// 新增数据
const distributionType = ref('type')
const distributionData = [
  { label: '设备', value: 1256, percentage: 45, color: '#409EFF' },
  { label: '配件', value: 856, percentage: 35, color: '#67C23A' },
  { label: '耗材', value: 244, percentage: 20, color: '#E6A23C' }
]

const warningList = [
  {
    type: 'shortage',
    title: '库存不足预警',
    description: '无人机 A-001 库存低于最低警戒线',
    time: '10分钟前'
  },
  {
    type: 'overstock',
    title: '库存积压预警',
    description: '配件 B-002 库存超过最高警戒线',
    time: '2小时前'
  },
  // ... 更多预警信息
]

// 方法定义
const getTypeTagType = (type) => {
  const map = {
    equipment: 'primary',
    parts: 'success',
    consumables: 'warning'
  }
  return map[type]
}

const getTypeLabel = (type) => {
  const map = {
    equipment: '设备',
    parts: '配件',
    consumables: '耗材'
  }
  return map[type]
}

const getStatusType = (status) => {
  const map = {
    normal: 'success',
    overstock: 'warning',
    shortage: 'danger'
  }
  return map[status]
}

const getStatusLabel = (status) => {
  const map = {
    normal: '正常',
    overstock: '积压',
    shortage: '短缺'
  }
  return map[status]
}

const getTurnoverClass = (rate) => {
  if (rate >= 50) return 'turnover-high'
  if (rate >= 30) return 'turnover-medium'
  return 'turnover-low'
}

const getHistoryColor = (type) => {
  const map = {
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C'
  }
  return map[type]
}

const getTrendClass = (trend) => {
  if (trend > 0) return 'up'
  if (trend < 0) return 'down'
  return 'stable'
}

const handleSearch = () => {
  ElMessage.success('执行搜索')
}

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
}

const handleExportData = () => {
  ElMessage.success('导出数据')
}

const handleRefreshData = () => {
  ElMessage.success('数据已更新')
}

const handleViewHistory = (row) => {
  historyDialogVisible.value = true
  // 加载变动记录...
}

const handleSupplyRequest = (row) => {
  supplyDialogVisible.value = true
  supplyForm.name = row.name
  supplyForm.currentStock = row.stock
  supplyForm.requestAmount = 1
  supplyForm.expectedDate = ''
  supplyForm.reason = ''
}

const handleSupplySubmit = async () => {
  if (!supplyFormRef.value) return
  await supplyFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('补货申请提交成功')
      supplyDialogVisible.value = false
    }
  })
}

const disabledDate = (time) => {
  return time.getTime() < Date.now()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}

const handleAnalysis = () => {
  ElMessage.success('正在生成库存分析报告')
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-btns {
  display: flex;
  gap: 10px;
}

.overview-section {
  margin-bottom: 20px;
}

.overview-card {
  padding: 20px;
  background: #ffffff;
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  position: relative;
}

.overview-badge {
  position: absolute;
  right: 0;
  top: 0;
}

.overview-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(64,158,255,0.1) 0%, rgba(64,158,255,0.2) 100%);
  
  &.primary {
    background: linear-gradient(135deg, rgba(64,158,255,0.1) 0%, rgba(64,158,255,0.2) 100%);
  }
  
  &.success {
    background: linear-gradient(135deg, rgba(103,194,58,0.1) 0%, rgba(103,194,58,0.2) 100%);
  }
  
  &.warning {
    background: linear-gradient(135deg, rgba(230,162,60,0.1) 0%, rgba(230,162,60,0.2) 100%);
  }
  
  &.info {
    background: linear-gradient(135deg, rgba(144,147,153,0.1) 0%, rgba(144,147,153,0.2) 100%);
  }
}

.overview-content {
  flex: 1;
}

.overview-title {
  font-size: 14px;
  color: #606266;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  margin: 12px 0;
  color: #303133;
}

.overview-details {
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
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
  
  &.primary {
    background: rgba(64,158,255,0.1);
    color: #409EFF;
  }
  
  &.success {
    background: rgba(103,194,58,0.1);
    color: #67C23A;
  }
  
  &.warning {
    background: rgba(230,162,60,0.1);
    color: #E6A23C;
  }
  
  &.danger {
    background: rgba(245,108,108,0.1);
    color: #F56C6C;
  }
  
  &.info {
    background: rgba(144,147,153,0.1);
    color: #909399;
  }
}

.detail-content {
  flex: 1;
}

.overview-chart {
  margin: 16px 0;
}

.chart-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  padding: 16px;
}

.search-select {
  width: 180px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.turnover-high {
  color: #67C23A;
  font-weight: bold;
}

.turnover-medium {
  color: #E6A23C;
  font-weight: bold;
}

.turnover-low {
  color: #F56C6C;
  font-weight: bold;
}

.history-detail {
  display: flex;
  gap: 20px;
  color: #909399;
  font-size: 13px;
  margin-top: 8px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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

.main-content {
  margin-top: 20px;
  
  .el-col {
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.stat-card {
  height: 100%;
  min-height: 350px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  &.warning-card {
    :deep(.el-scrollbar) {
      height: 250px;
    }
  }
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

.chart-container {
  padding: 10px 0;
}

.distribution-progress {
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  color: #606266;
  font-size: 13px;
}

.warning-list {
  padding: 0 10px;
}

.warning-item {
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .el-icon {
    margin-top: 2px;
    margin-right: 8px;
    font-size: 16px;
    
    &.shortage {
      color: #F56C6C;
    }
    
    &.overstock {
      color: #E6A23C;
    }
  }
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.warning-desc {
  color: #909399;
  font-size: 13px;
  margin-bottom: 4px;
}

.warning-time {
  color: #C0C4CC;
  font-size: 12px;
}

.supply-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 10px;
  height: calc(100% - 100px);
  align-content: center;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f2f5;
  }
}

.stat-label {
  color: #909399;
  font-size: 13px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  
  &.success {
    color: #67C23A;
  }
  
  &.warning {
    color: #E6A23C;
  }
}

.trend-value {
  font-weight: 500;
}

.trend-label {
  color: #909399;
  margin: 0 4px;
}

.overview-trend {
  &.stable {
    color: #909399;
  }
}

.overview-details {
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-label {
  color: #909399;
}

.detail-value {
  font-weight: 500;
  
  &.primary {
    color: #409EFF;
  }
  
  &.success {
    color: #67C23A;
  }
  
  &.warning {
    color: #E6A23C;
  }
  
  &.danger {
    color: #F56C6C;
  }
  
  &.info {
    color: #909399;
  }
}
</style>
