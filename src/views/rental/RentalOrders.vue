<template>
  <div class="rental-orders">
    <div class="header">
      <h2>租赁订单管理</h2>
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索订单号/客户姓名"
          clearable
          class="search-input">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="订单状态" clearable>
          <el-option label="待支付" value="待支付" />
          <el-option label="进行中" value="进行中" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已取消" value="已取消" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <el-table :data="orderList" style="width: 100%">
      <el-table-column prop="orderNo" label="订单编号" width="120" />
      <el-table-column prop="equipmentName" label="设备名称" width="150" />
      <el-table-column prop="customerName" label="客户姓名" width="120" />
      <el-table-column label="租赁期限" width="240">
        <template #default="{ row }">
          {{ formatDate(row.startDate) }} 至 {{ formatDate(row.endDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="deposit" label="押金" width="120">
        <template #default="{ row }">
          <money-amount :amount="row.deposit" />
        </template>
      </el-table-column>
      <el-table-column prop="rentalFee" label="租金" width="120">
        <template #default="{ row }">
          <money-amount :amount="row.rentalFee" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <order-status-tag :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            size="small"
            type="primary"
            @click="handleProcess(row)"
            v-if="row.status === '进行中'">
            处理
          </el-button>
          <el-button size="small" @click="handleDetails(row)">详情</el-button>
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

    <order-process-dialog
      v-model:visible="processDialogVisible"
      :title="'处理订单 - ' + currentOrder?.orderNo"
      @submit="handleProcessSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { OrderStatusTag, MoneyAmount } from '@/components/rental'
import OrderProcessDialog from '@/components/rental/OrderProcessDialog.vue'
import { orderService } from '@/services/rental/orderService'
import { formatDate } from '@/utils/format'

const searchForm = ref({
  keyword: '',
  status: ''
})
const orderList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const processDialogVisible = ref(false)
const currentOrder = ref(null)

const loadData = async () => {
  try {
    const { list, total: totalCount } = await orderService.getOrders({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    orderList.value = list
    total.value = totalCount
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleProcess = (row) => {
  currentOrder.value = row
  processDialogVisible.value = true
}

const handleProcessSubmit = async (formData) => {
  try {
    await orderService.processOrder(
      currentOrder.value.id,
      formData.action,
      formData
    )
    ElMessage.success('处理成功')
    loadData()
  } catch (error) {
    ElMessage.error('处理失败')
  }
}

const handleDetails = (row) => {
  // Implement view details logic
  console.log('View details:', row)
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
})
</script>

<style scoped>
.rental-orders {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>