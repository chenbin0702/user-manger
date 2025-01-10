<template>
  <div class="order-management">
    <div class="header">
      <h2>订单管理</h2>
      <div class="actions">
        <el-button type="primary" @click="exportData">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
      </div>
    </div>

    <OrderStatistics :statistics="statistics" @period-change="handlePeriodChange" />
    
    <OrderTabs 
      :order-counts="orderCounts"
      v-model:active-status="activeStatus"
    />

    <OrderTable 
      :loading="loading"
      :orders="filteredOrders"
      :total="total"
      v-model:page="currentPage"
      v-model:page-size="pageSize"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <OrderDetail
      v-model:visible="detailVisible"
      :order-data="currentOrder"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import OrderStatistics from './components/OrderStatistics.vue'
import OrderTabs from './components/OrderTabs.vue'
import OrderTable from './components/OrderTable.vue'
import OrderDetail from './components/OrderDetail.vue'
import { orderService } from '@/services/orderService'

const loading = ref(false)
const activeStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailVisible = ref(false)
const currentOrder = ref(null)

const statistics = ref({
  totalOrders: 0,
  totalAmount: 0,
  typeDistribution: []
})

const orderCounts = ref({
  all: 0,
  pending: 0,
  processing: 0,
  completed: 0,
  cancelled: 0
})

const filteredOrders = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const { orders, total: totalCount } = await orderService.getOrders({
      page: currentPage.value,
      pageSize: pageSize.value,
      status: activeStatus.value
    })
    filteredOrders.value = orders
    total.value = totalCount
    
    // Load statistics
    statistics.value = await orderService.getStatistics()
    orderCounts.value = await orderService.getOrderCounts()
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handlePeriodChange = (period) => {
  // Reload statistics with new period
  loadData()
}

const handleView = (order) => {
  currentOrder.value = order
  detailVisible.value = true
}

const handleEdit = (order) => {
  // Implement edit logic
}

const handleDelete = async (order) => {
  try {
    await orderService.deleteOrder(order.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const exportData = () => {
  // Implement export logic
  ElMessage.success('数据导出成功')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.order-management {
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
  gap: 12px;
}
</style>