<template>
  <div class="claims-orders">
    <div class="header">
      <h2>理赔管理</h2>
      <div class="actions">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索理赔编号/申请人"
          clearable
          class="search-input">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="理赔状态" clearable>
          <el-option label="待审核" value="待审核" />
          <el-option label="已通过" value="已通过" />
          <el-option label="已拒绝" value="已拒绝" />
          <el-option label="已赔付" value="已赔付" />
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
              <span>理赔总数</span>
            </div>
          </template>
          <div class="card-content">856</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月理赔</span>
            </div>
          </template>
          <div class="card-content">156</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>理赔总额</span>
            </div>
          </template>
          <div class="card-content">¥198.6万</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>平均时效</span>
            </div>
          </template>
          <div class="card-content">3.5天</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>理赔趋势统计</span>
              <div class="legend">
                <span class="legend-item">
                  <span class="dot claims"></span>理赔数量
                </span>
                <span class="legend-item">
                  <span class="dot amount"></span>理赔金额
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
              <span>理赔类型分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 理赔列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>理赔列表</span>
        </div>
      </template>
      <el-table :data="claims" style="width: 100%">
        <el-table-column prop="claimNo" label="理赔编号" width="120" />
        <el-table-column prop="policyNo" label="保单编号" width="120" />
        <el-table-column prop="customerName" label="申请人" width="120" />
        <el-table-column prop="claimType" label="理赔类型" width="120" />
        <el-table-column prop="amount" label="理赔金额" width="120">
          <template #default="{ row }">
            ¥{{ formatAmount(row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="申请时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              size="small"
              type="primary"
              @click="handleProcess(row)"
              v-if="row.status === '待审核'">
              审核
            </el-button>
            <el-button size="small" @click="handleView(row)">查看</el-button>
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

    <!-- 理赔审核对话框 -->
    <el-dialog
      v-model="processDialogVisible"
      title="理赔审核"
      width="500px">
      <el-form
        ref="processFormRef"
        :model="processForm"
        :rules="processRules"
        label-width="100px">
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="processForm.result">
            <el-radio label="approve">通过</el-radio>
            <el-radio label="reject">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item 
          label="赔付金额" 
          prop="amount"
          v-if="processForm.result === 'approve'">
          <el-input-number 
            v-model="processForm.amount"
            :min="0"
            :precision="2"
            :step="100"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="审核意见" prop="remarks">
          <el-input
            v-model="processForm.remarks"
            type="textarea"
            :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="processDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleProcessSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 理赔详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="理赔详情"
      width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="理赔编号">{{ currentClaim?.claimNo }}</el-descriptions-item>
        <el-descriptions-item label="保单编号">{{ currentClaim?.policyNo }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ currentClaim?.customerName }}</el-descriptions-item>
        <el-descriptions-item label="理赔类型">{{ currentClaim?.claimType }}</el-descriptions-item>
        <el-descriptions-item label="理赔金额">¥{{ formatAmount(currentClaim?.amount) }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentClaim?.submitTime }}</el-descriptions-item>
        <el-descriptions-item label="理赔状态">
          <el-tag :type="getStatusType(currentClaim?.status)">{{ currentClaim?.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="处理时间" v-if="currentClaim?.processTime">
          {{ currentClaim?.processTime }}
        </el-descriptions-item>
        <el-descriptions-item label="事故描述" :span="2">{{ currentClaim?.description }}</el-descriptions-item>
        <el-descriptions-item label="审核意见" :span="2" v-if="currentClaim?.remarks">
          {{ currentClaim?.remarks }}
        </el-descriptions-item>
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

// 理赔数据
const claims = ref([
  {
    claimNo: 'CLM20240120001',
    policyNo: 'POL20240120001',
    customerName: '张三',
    claimType: '设备损坏',
    amount: 5000.00,
    status: '待审核',
    submitTime: '2024-01-20 10:00:00',
    description: '无人机在飞行过程中发生碰撞，造成机身损坏'
  },
  {
    claimNo: 'CLM20240120002',
    policyNo: 'POL20240120002',
    customerName: '李四',
    claimType: '第三者责任',
    amount: 8000.00,
    status: '已通过',
    submitTime: '2024-01-20 11:30:00',
    processTime: '2024-01-21 09:00:00',
    description: '无人机操作失误，造成他人财产损失',
    remarks: '理赔申请材料完整，损失情况属实，同意赔付'
  }
])

// 图表引用
const trendChartRef = ref(null)
const pieChartRef = ref(null)
let trendChart = null
let pieChart = null

// 对话框状态
const processDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentClaim = ref(null)

// 处理表单
const processFormRef = ref(null)
const processForm = ref({
  result: 'approve',
  amount: 0,
  remarks: ''
})

// 表单验证规则
const processRules = {
  result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
  amount: [{ required: true, message: '请输入赔付金额', trigger: 'blur' }],
  remarks: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
}

// 获取状态样式
const getStatusType = (status) => {
  const types = {
    '待审核': 'warning',
    '已通过': 'success',
    '已拒绝': 'danger',
    '已赔付': 'info'
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
          name: '理赔数量',
          position: 'left'
        },
        {
          type: 'value',
          name: '理赔金额(万)',
          position: 'right'
        }
      ],
      series: [
        {
          name: '理赔数量',
          type: 'bar',
          data: [100, 120, 90, 110, 90, 150]
        },
        {
          name: '理赔金额',
          type: 'line',
          yAxisIndex: 1,
          data: [20, 25, 18, 22, 18, 30]
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
            { value: 40, name: '设备损坏' },
            { value: 30, name: '第三者责任' },
            { value: 20, name: '人身伤害' },
            { value: 10, name: '其他' }
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

// 处理理赔
const handleProcess = (row) => {
  currentClaim.value = row
  processForm.value = {
    result: 'approve',
    amount: row.amount,
    remarks: ''
  }
  processDialogVisible.value = true
}

// 提交处理结果
const handleProcessSubmit = async () => {
  if (!processFormRef.value) return
  
  await processFormRef.value.validate((valid) => {
    if (valid) {
      // 实现处理逻辑
      ElMessage.success('处理成功')
      processDialogVisible.value = false
      loadData()
    }
  })
}

// 查看详情
const handleView = (row) => {
  currentClaim.value = row
  detailDialogVisible.value = true
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
.claims-orders {
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

.dot.claims {
  background-color: #409EFF;
}

.dot.amount {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>