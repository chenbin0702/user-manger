<template>
  <div class="rental-rules">
    <div class="header">
      <h2>租赁规则管理</h2>
    </div>

    <el-table :data="ruleList" style="width: 100%">
      <el-table-column prop="categoryName" label="设备分类" width="150" />
      <el-table-column label="租期限制" width="200">
        <template #default="{ row }">
          {{ row.minDuration }}-{{ row.maxDuration }}天
        </template>
      </el-table-column>
      <el-table-column prop="depositAmount" label="押金" width="120">
        <template #default="{ row }">
          <money-amount :amount="row.depositAmount" />
        </template>
      </el-table-column>
      <el-table-column prop="dailyRate" label="日租金" width="120">
        <template #default="{ row }">
          <money-amount :amount="row.dailyRate" />
        </template>
      </el-table-column>
      <el-table-column prop="overdueFee" label="逾期费用/天" width="120">
        <template #default="{ row }">
          <money-amount :amount="row.overdueFee" />
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'info'">
            {{ row.isActive ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <rule-form
      v-model:visible="formVisible"
      :rule-data="currentRule"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { MoneyAmount, RuleForm } from '@/components/rental'
import { rentalService } from '@/services/rentalService'

const ruleList = ref([])
const formVisible = ref(false)
const currentRule = ref(null)

const loadRules = async () => {
  try {
    ruleList.value = await rentalService.getRentalRules()
  } catch (error) {
    ElMessage.error('获取租赁规则失败')
  }
}

const handleEdit = (row) => {
  currentRule.value = { ...row }
  formVisible.value = true
}

const handleSubmit = async (formData) => {
  try {
    await rentalService.updateRentalRule(currentRule.value.id, formData)
    ElMessage.success('更新成功')
    loadRules()
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

onMounted(() => {
  loadRules()
})
</script>

<style scoped>
.rental-rules {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}
</style>