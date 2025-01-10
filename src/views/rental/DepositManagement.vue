<template>
  <div class="deposit-management">
    <div class="header">
      <h2>押金管理</h2>
    </div>

    <el-row :gutter="20" class="statistics-row">
      <el-col :span="8">
        <statistics-card
          title="押金总额"
          :value="statistics.totalDeposit"
        />
      </el-col>
      <el-col :span="8">
        <statistics-card
          title="待退还押金"
          :value="statistics.pendingDeposit"
        />
      </el-col>
      <el-col :span="8">
        <statistics-card
          title="本月退还金额"
          :value="statistics.monthlyRefund"
        />
      </el-col>
    </el-row>

    <el-card class="deposit-list">
      <template #header>
        <div class="card-header">
          <span>押金记录</span>
          <el-select v-model="searchForm.status" placeholder="状态筛选" clearable>
            <el-option label="待退还" value="待退还" />
            <el-option label="已退还" value="已退还" />
            <el-option label="已扣除" value="已扣除" />
          </el-select>
        </div>
      </template>

      <el-table :data="depositList" style="width: 100%">
        <el-table-column prop="orderNo" label="订单编号" width="120" />
        <el-table-column prop="customerName" label="客户姓名" width="120" />
        <el-table-column prop="amount" label="押金金额" width="120">
          <template #default="{ row }">
            <money-amount :amount="row.amount" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === '收取' ? 'success' : 'warning'">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <order-status-tag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="time" label="操作时间" width="180" />
        <el-table-column prop="remarks" label="备注" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button 
              size="small"
              type="primary"
              @click="handleRefund(row)"
              v-if="row.status === '待退还'">
              退还押金
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

    <el-dialog
      v-model="dialogVisible"
      title="退还押金"
      width="500px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="退还金额" prop="amount">
          <el-input-number 
            v-model="form.amount"
            :min="0"
            :precision="2"
            :step="100"
            controls-position="right"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input
            v-model="form.remarks"
            type="textarea"
            :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { OrderStatusTag, MoneyAmount, StatisticsCard } from '@/components/rental'
import { rentalService } from '@/services/rentalService'

const searchForm = ref({ status: '' })
const depositList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const formRef = ref(null)
const currentDeposit = ref(null)
const statistics = ref({
  totalDeposit: 0,
  pendingDeposit: 0,
  monthlyRefund: 0
})

const form = ref({
  amount: 0,
  remarks: ''
})

const rules = {
  amount: [{ required: true, message: '请输入退还金额', trigger: 'blur' }],
  remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

const loadData = async () => {
  try {
    const { list, total: totalCount } = await rentalService.getDepositRecords({
      page: currentPage.value,
      pageSize: pageSize.value,
      status: searchForm.value.status
    })
    depositList.value = list
    total.value = totalCount
  } catch (error) {
    ElMessage.error('获取押金记录失败')
  }
}

const loadStatistics = async () => {
  try {
    statistics.value = await rentalService.getDepositStatistics()
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  }
}

const handleRefund = (row) => {
  currentDeposit.value = row
  form.value.amount = row.amount
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      try {
        // 实现退还押金逻辑
        ElMessage.success('押金退还成功')
        dialogVisible.value = false
        loadData()
        loadStatistics()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

onMounted(() => {
  loadData()
  loadStatistics()
})
</script>

<style scoped>
.deposit-management {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.statistics-row {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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