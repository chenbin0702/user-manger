<template>
  <div class="order-table">
    <div class="table-header">
      <el-input
        v-model="searchQuery"
        placeholder="搜索订单号/客户信息"
        class="search-input"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <el-table
      v-loading="loading"
      :data="orders"
      style="width: 100%">
      <el-table-column prop="orderNo" label="订单编号" width="120" sortable />
      <el-table-column prop="type" label="订单类型" width="120" />
      <el-table-column prop="customerName" label="客户姓名" width="120" />
      <el-table-column prop="amount" label="订单金额" width="120">
        <template #default="{ row }">
          ¥{{ formatAmount(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" sortable />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)">查看</el-button>
          <el-button 
            size="small" 
            type="primary" 
            @click="handleEdit(row)"
            :disabled="!canEdit(row)">
            编辑
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleDelete(row)"
            :disabled="!canDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="currentPageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { formatAmount } from '@/utils/format'

const props = defineProps({
  loading: Boolean,
  orders: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:page', 'update:page-size', 'view', 'edit', 'delete'])

const searchQuery = ref('')

const currentPage = computed({
  get: () => props.page,
  set: (value) => emit('update:page', value)
})

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (value) => emit('update:page-size', value)
})

const getStatusType = (status) => {
  const types = {
    '待付款': 'warning',
    '进行中': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  }
  return types[status] || 'info'
}

const canEdit = (order) => {
  return ['待付款', '进行中'].includes(order.status)
}

const canDelete = (order) => {
  return ['待付款', '已取消'].includes(order.status)
}

const handleSearch = () => {
  currentPage.value = 1
  // Emit search event
}

const handleView = (row) => {
  emit('view', row)
}

const handleEdit = (row) => {
  emit('edit', row)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除订单 ${row.orderNo} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    emit('delete', row)
  })
}

const handleSizeChange = (val) => {
  currentPageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.order-table {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.table-header {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>