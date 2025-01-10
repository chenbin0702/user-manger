<template>
  <div class="certificate-orders">
    <div class="header">
      <h2>考证订单管理</h2>
      <div class="actions">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索订单号/学员姓名"
          clearable
          class="search-input">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="订单状态" clearable>
          <el-option label="待支付" value="待支付" />
          <el-option label="已支付" value="已支付" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已取消" value="已取消" />
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
              <span>总订单数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.totalOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总金额</span>
            </div>
          </template>
          <div class="card-content">¥{{ formatAmount(statistics.totalAmount) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月订单</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.monthlyOrders }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>完成率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.completionRate }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单列表 -->
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="orderNo" label="订单编号" width="120" />
      <el-table-column prop="certificateType" label="证书类型" width="150" />
      <el-table-column prop="studentName" label="学员姓名" width="120" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="amount" label="订单金额" width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="examDate" label="考试日期" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            size="small"
            type="primary"
            @click="handleProcess(row)"
            v-if="row.status === '已支付'">
            处理
          </el-button>
          <el-button size="small" @click="handleView(row)">查看</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleCancel(row)"
            v-if="row.status === '待支付'">
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

    <!-- 订单处理对话框 -->
    <el-dialog
      v-model="processDialogVisible"
      title="处理考证订单"
      width="500px">
      <el-form
        ref="processFormRef"
        :model="processForm"
        :rules="processRules"
        label-width="100px">
        <el-form-item label="处理结果" prop="result">
          <el-radio-group v-model="processForm.result">
            <el-radio label="pass">通过</el-radio>
            <el-radio label="fail">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证书编号" prop="certificateNo" v-if="processForm.result === 'pass'">
          <el-input v-model="processForm.certificateNo" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
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

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{ currentOrder?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="证书类型">{{ currentOrder?.certificateType }}</el-descriptions-item>
        <el-descriptions-item label="学员姓名">{{ currentOrder?.studentName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentOrder?.phone }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ formatAmount(currentOrder?.amount) }}</el-descriptions-item>
        <el-descriptions-item label="考试日期">{{ currentOrder?.examDate }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(currentOrder?.status)">{{ currentOrder?.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentOrder?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="证书编号" v-if="currentOrder?.certificateNo">
          {{ currentOrder?.certificateNo }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentOrder?.remarks || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
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

// 统计数据
const statistics = ref({
  totalOrders: 1256,
  totalAmount: 298600.00,
  monthlyOrders: 156,
  completionRate: 85
})

// 订单数据
const orders = ref([
  {
    orderNo: 'CER20240120001',
    certificateType: '无人机驾驶员合格证',
    studentName: '张三',
    phone: '13800138000',
    amount: 1999.00,
    examDate: '2024-02-15',
    status: '待支付',
    createTime: '2024-01-20 10:00:00'
  },
  {
    orderNo: 'CER20240120002',
    certificateType: '无人机维修资质证',
    studentName: '李四',
    phone: '13900139000',
    amount: 2999.00,
    examDate: '2024-02-20',
    status: '已支付',
    createTime: '2024-01-20 11:30:00'
  }
])

// 对话框状态
const processDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentOrder = ref(null)

// 处理表单
const processFormRef = ref(null)
const processForm = ref({
  result: 'pass',
  certificateNo: '',
  remarks: ''
})

// 表单验证规则
const processRules = {
  result: [{ required: true, message: '请选择处理结果', trigger: 'change' }],
  certificateNo: [{ required: true, message: '请输入证书编号', trigger: 'blur' }],
  remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

// 获取状态样式
const getStatusType = (status) => {
  const types = {
    '待支付': 'warning',
    '已支付': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  }
  return types[status] || 'info'
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 处理订单
const handleProcess = (row) => {
  currentOrder.value = row
  processForm.value = {
    result: 'pass',
    certificateNo: '',
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
  currentOrder.value = row
  detailDialogVisible.value = true
}

// 取消订单
const handleCancel = (row) => {
  ElMessageBox.confirm(
    `确定要取消订单 ${row.orderNo} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现取消逻辑
    ElMessage.success('订单已取消')
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

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.certificate-orders {
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