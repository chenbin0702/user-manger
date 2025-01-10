<template>
  <div class="pilot-qualification">
    <div class="header">
      <h2>飞手资质审核</h2>
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索姓名/证书编号"
          clearable
          @clear="handleSearch"
          class="search-input">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="审核状态" clearable>
          <el-option label="待审核" value="待审核" />
          <el-option label="已通过" value="已通过" />
          <el-option label="已拒绝" value="已拒绝" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <el-table :data="qualificationList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="licenseType" label="证书类型" width="150" />
      <el-table-column prop="experience" label="飞行经验" width="120" />
      <el-table-column prop="flightHours" label="飞行小时" width="120" />
      <el-table-column prop="submitTime" label="提交时间" width="180" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <status-tag :status="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button 
            v-if="row.status === '待审核'"
            size="small" 
            type="primary" 
            @click="handleReview(row)">
            审核
          </el-button>
          <el-button size="small" @click="handleViewDocuments(row)">
            查看材料
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

    <review-dialog
      v-model:visible="reviewDialogVisible"
      title="飞手资质审核"
      @submit="handleReviewSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import StatusTag from '@/components/common/StatusTag.vue'
import ReviewDialog from '@/components/auth/ReviewDialog.vue'
import { authService } from '@/services/authService'

const searchForm = ref({
  keyword: '',
  status: ''
})
const qualificationList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const reviewDialogVisible = ref(false)
const currentRecord = ref(null)

const loadData = async () => {
  try {
    const { list, total: totalCount } = await authService.getPilotQualifications({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    qualificationList.value = list
    total.value = totalCount
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

onMounted(() => {
  loadData()
})

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

const handleReview = (row) => {
  currentRecord.value = row
  reviewDialogVisible.value = true
}

const handleReviewSubmit = async (formData) => {
  try {
    await authService.updateVerificationStatus(
      currentRecord.value.id,
      formData.status,
      formData.remarks
    )
    ElMessage.success('审核完成')
    loadData()
  } catch (error) {
    ElMessage.error('审核失败')
  }
}

const handleViewDocuments = (row) => {
  // 实现查看材料逻辑
  console.log('View documents:', row)
}
</script>

<style scoped>
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