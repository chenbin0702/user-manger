<template>
  <div class="policy-orders">
    <div class="header">
      <h2>保单管理</h2>
      <div class="actions">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索保单号/投保人"
          clearable
          class="search-input">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="保单状态" clearable>
          <el-option label="生效中" value="生效中" />
          <el-option label="待生效" value="待生效" />
          <el-option label="已过期" value="已过期" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总保单数</span>
            </div>
          </template>
          <div class="card-content">1256</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>生效保单</span>
            </div>
          </template>
          <div class="card-content">986</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总保费收入</span>
            </div>
          </template>
          <div class="card-content">¥298.6万</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>理赔率</span>
            </div>
          </template>
          <div class="card-content">15.8%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>月度保单趋势</span>
              <div class="legend">
                <span class="legend-item">
                  <span class="dot policy"></span>保单数量
                </span>
                <span class="legend-item">
                  <span class="dot premium"></span>保费收入
                </span>
              </div>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>保险产品分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 保单列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>保单列表</span>
        </div>
      </template>
      <el-table :data="policies" style="width: 100%">
        <el-table-column prop="policyNo" label="保单编号" width="120" />
        <el-table-column prop="insuranceType" label="保险类型" width="150" />
        <el-table-column prop="customerName" label="投保人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="premium" label="保费" width="120">
          <template #default="{ row }">
            ¥{{ formatAmount(row.premium) }}
          </template>
        </el-table-column>
        <el-table-column prop="coverage" label="保额" width="120">
          <template #default="{ row }">
            ¥{{ formatAmount(row.coverage) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="effectiveDate" label="生效日期" width="120" />
        <el-table-column prop="expiryDate" label="到期日期" width="120" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleCancel(row)"
              v-if="row.status === '待生效'">
              取消
            </el-button>
          </template>
        </el-table-column>
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

    <!-- 保单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="保单详情"
      width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="保单编号">{{ currentPolicy?.policyNo }}</el-descriptions-item>
        <el-descriptions-item label="保险类型">{{ currentPolicy?.insuranceType }}</el-descriptions-item>
        <el-descriptions-item label="投保人">{{ currentPolicy?.customerName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentPolicy?.phone }}</el-descriptions-item>
        <el-descriptions-item label="保费">¥{{ formatAmount(currentPolicy?.premium) }}</el-descriptions-item>
        <el-descriptions-item label="保额">¥{{ formatAmount(currentPolicy?.coverage) }}</el-descriptions-item>
        <el-descriptions-item label="生效日期">{{ currentPolicy?.effectiveDate }}</el-descriptions-item>
        <el-descriptions-item label="到期日期">{{ currentPolicy?.expiryDate }}</el-descriptions-item>
        <el-descriptions-item label="保单状态">
          <el-tag :type="getStatusType(currentPolicy?.status)">{{ currentPolicy?.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentPolicy?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentPolicy?.remarks || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { formatAmount } from '@/utils/format'

// 搜索表单
const searchForm = ref({
  keyword: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 保单数据
const policies = ref([
  {
    policyNo: 'POL20240120001',
    insuranceType: '无人机综合险',
    customerName: '张三',
    phone: '13800138000',
    premium: 1999.00,
    coverage: 100000.00,
    status: '生效中',
    effectiveDate: '2024-01-20',
    expiryDate: '2024-12-31',
    createTime: '2024-01-20 10:00:00'
  },
  {
    policyNo: 'POL20240120002',
    insuranceType: '第三者责任险',
    customerName: '李四',
    phone: '13900139000',
    premium: 2999.00,
    coverage: 200000.00,
    status: '待生效',
    effectiveDate: '2024-02-01',
    expiryDate: '2024-12-31',
    createTime: '2024-01-20 11:30:00'
  }
])

// 图表引用
const trendChartRef = ref(null)
const pieChartRef = ref(null)
let trendChart = null
let pieChart = null

// 对话框状态
const detailDialogVisible = ref(false)
const currentPolicy = ref(null)

// 获取状态样式
const getStatusType = (status) => {
  const types = {
    '生效中': 'success',
    '待生效': 'warning',
    '已过期': 'info'
  }
  return types[status] || 'info'
}

// 初始化图表
const initCharts = () => {
  // 趋势图
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const months = ['1月', '2月', '3月', '4月', '5月', '6月']
    trendChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: [
        {
          type: 'value',
          name: '保单数量',
          position: 'left'
        },
        {
          type: 'value',
          name: '保费收入(万)',
          position: 'right'
        }
      ],
      series: [
        {
          name: '保单数量',
          type: 'bar',
          data: [150, 180, 160, 180, 150, 200]
        },
        {
          name: '保费收入',
          type: 'line',
          yAxisIndex: 1,
          data: [30, 35, 32, 36, 30, 40]
        }
      ]
    })
  }

  // 饼图
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
          data: [
            { value: 40, name: '无人机综合险' },
            { value: 25, name: '第三者责任险' },
            { value: 20, name: '人身意外险' },
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

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 查看详情
const handleView = (row) => {
  currentPolicy.value = row
  detailDialogVisible.value = true
}

// 取消保单
const handleCancel = (row) => {
  ElMessageBox.confirm(
    `确定要取消保单 ${row.policyNo} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现取消逻辑
    ElMessage.success('保单已取消')
    loadData()
  })
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
}

// 生命周期钩子
onMounted(() => {
  loadData()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (trendChart) trendChart.dispose()
  if (pieChart) pieChart.dispose()
})

const handleResize = () => {
  if (trendChart) trendChart.resize()
  if (pieChart) pieChart.resize()
}
</script>

<style scoped>
.policy-orders {
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

.search-input {
  width: 200px;
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

.legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.policy {
  background-color: #409EFF;
}

.dot.premium {
  background-color: #67C23A;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>