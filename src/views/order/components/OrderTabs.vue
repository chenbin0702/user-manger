<template>
  <div class="order-tabs">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="全部订单" name="">
        <template #label>
          全部订单 <el-badge :value="orderCounts.all" />
        </template>
      </el-tab-pane>
      <el-tab-pane name="pending">
        <template #label>
          待付款 <el-badge :value="orderCounts.pending" type="warning" />
        </template>
      </el-tab-pane>
      <el-tab-pane name="processing">
        <template #label>
          进行中 <el-badge :value="orderCounts.processing" type="primary" />
        </template>
      </el-tab-pane>
      <el-tab-pane name="completed">
        <template #label>
          已完成 <el-badge :value="orderCounts.completed" type="success" />
        </template>
      </el-tab-pane>
      <el-tab-pane name="cancelled">
        <template #label>
          已取消 <el-badge :value="orderCounts.cancelled" type="info" />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orderCounts: {
    type: Object,
    required: true
  },
  activeStatus: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:active-status'])

const activeTab = computed({
  get: () => props.activeStatus,
  set: (value) => emit('update:active-status', value)
})

const handleTabClick = (tab) => {
  activeTab.value = tab.props.name
}
</script>

<style scoped>
.order-tabs {
  margin-bottom: 20px;
}
</style>