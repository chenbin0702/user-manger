<template>
  <div class="app-container">
    <div class="header-section">
      <h2>合作商信用管理</h2>
      <el-button type="primary" @click="handleRefreshScore">
        <el-icon><Refresh /></el-icon>更新评分
      </el-button>
    </div>
 <!-- 搜索栏 -->
     <el-card class="search-card">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="合作商名称">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入合作商名称" 
            clearable
            class="search-input" 
          />
        </el-form-item>
        <el-form-item label="信用等级">
          <el-select 
            v-model="searchForm.level" 
            placeholder="请选择信用等级" 
            clearable
            class="search-select"
          >
            <el-option label="优秀" value="excellent" />
            <el-option label="良好" value="good" />
            <el-option label="一般" value="normal" />
            <el-option label="较差" value="poor" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="search-btn">
            <el-icon><Search /></el-icon>查询
          </el-button>
          <el-button @click="resetSearch" class="search-btn">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 信用评分概览卡片 -->
    <el-row :gutter="20" class="credit-overview">
      <el-col :span="6" v-for="item in creditOverview" :key="item.level">
        <el-card :class="['credit-card', item.class]" shadow="hover">
          <div class="credit-card-content">
            <div class="credit-level">{{ item.level }}</div>
            <div class="credit-count">{{ item.count }}家</div>
            <div class="credit-range">信用分：{{ item.range }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

   

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="合作商名称" min-width="120" />
        <el-table-column prop="creditScore" label="信用评分" width="100">
          <template #default="{ row }">
            <span :class="getCreditScoreClass(row.creditScore)">{{ row.creditScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creditLevel" label="信用等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getCreditLevelType(row.creditLevel)">
              {{ row.creditLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评分维度" min-width="400">
          <template #default="{ row }">
            <div class="score-dimensions">
              <el-tooltip 
                v-for="(score, key) in row.dimensions" 
                :key="key"
                :content="getDimensionTooltip(key, score)"
                placement="top"
              >
                <div class="dimension-item">
                  <span class="dimension-label">{{ getDimensionLabel(key) }}</span>
                  <el-progress 
                    :percentage="score" 
                    :color="getDimensionColor(score)"
                    :stroke-width="8"
                    :show-text="false"
                  />
                  <span class="dimension-score">{{ score }}分</span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="handleAdjustCredit(row)">调整</el-button>
            <el-button link type="warning" @click="handleManagePolicy(row)">策略</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 信用分调整对话框 -->
    <el-dialog
      title="调整信用分"
      v-model="adjustDialogVisible"
      width="500px"
    >
      <el-form
        ref="adjustFormRef"
        :model="adjustForm"
        :rules="adjustFormRules"
        label-width="100px"
      >
        <el-form-item label="当前分数">
          <span>{{ adjustForm.currentScore }}</span>
        </el-form-item>
        <el-form-item label="调整分数" prop="adjustScore">
          <el-input-number 
            v-model="adjustForm.adjustScore"
            :min="-10"
            :max="10"
            :step="0.5"
          />
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input 
            type="textarea"
            v-model="adjustForm.reason"
            rows="3"
            placeholder="请输入调整原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="adjustDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdjustSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 管理策略对话框 -->
    <el-dialog
      title="信用管理策略"
      v-model="policyDialogVisible"
      width="600px"
    >
      <el-form label-width="120px">
        <el-form-item label="信用额度">
          <el-input-number 
            v-model="policyForm.creditLimit"
            :min="0"
            :step="1000"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="供货优先级">
          <el-rate 
            v-model="policyForm.supplyPriority"
            :max="3"
            :texts="['低', '中', '高']"
            show-text
          />
        </el-form-item>
        <el-form-item label="优惠政策">
          <el-checkbox-group v-model="policyForm.benefits">
            <el-checkbox label="discount">价格优惠</el-checkbox>
            <el-checkbox label="delivery">免费配送</el-checkbox>
            <el-checkbox label="return">无理由退换</el-checkbox>
            <el-checkbox label="technical">技术支持</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="监管频率">
          <el-select v-model="policyForm.monitorFrequency">
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
            <el-option label="每季" value="quarterly" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="policyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePolicySubmit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 信用等级概览数据
const creditOverview = [
  { level: '优秀', count: 28, range: '90-100', class: 'excellent' },
  { level: '良好', count: 45, range: '75-89', class: 'good' },
  { level: '一般', count: 32, range: '60-74', class: 'normal' },
  { level: '较差', count: 12, range: '0-59', class: 'poor' }
]

// 搜索表单
const searchForm = reactive({
  name: '',
  level: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '示例合作商',
    creditScore: 88,
    creditLevel: '良好',
    dimensions: {
      performance: 85,
      orderProcess: 90,
      inventory: 86,
      promotion: 88,
      compliance: 92
    },
    updateTime: '2024-03-15 14:30:00'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 调整对话框相关
const adjustDialogVisible = ref(false)
const adjustFormRef = ref(null)
const adjustForm = reactive({
  currentScore: 0,
  adjustScore: 0,
  reason: ''
})

// 策略对话框相关
const policyDialogVisible = ref(false)
const policyForm = reactive({
  creditLimit: 50000,
  supplyPriority: 2,
  benefits: ['discount', 'technical'],
  monitorFrequency: 'monthly'
})

// 表单校验规则
const adjustFormRules = {
  adjustScore: [{ required: true, message: '请输入调整分数', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入调整原因', trigger: 'blur' }]
}

// 评分维度标签映射
const dimensionLabels = {
  performance: '业绩表现',
  orderProcess: '订单处理',
  inventory: '库存管理',
  promotion: '推广效果',
  compliance: '规则遵守'
}

// 方法定义
const getCreditScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 75) return 'score-good'
  if (score >= 60) return 'score-normal'
  return 'score-poor'
}

const getCreditLevelType = (level) => {
  const map = {
    '优秀': 'success',
    '良好': 'primary',
    '一般': 'warning',
    '较差': 'danger'
  }
  return map[level]
}

const getDimensionLabel = (key) => dimensionLabels[key]

const getDimensionTooltip = (key, score) => {
  return `${dimensionLabels[key]}: ${score}分`
}

const getDimensionColor = (score) => {
  if (score >= 90) return '#67C23A'
  if (score >= 75) return '#409EFF'
  if (score >= 60) return '#E6A23C'
  return '#F56C6C'
}

const handleRefreshScore = () => {
  ElMessage.success('信用评分更新成功')
}

const handleSearch = () => {
  ElMessage.success('执行搜索')
}

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
}

const handleViewDetail = (row) => {
  ElMessage.info('查看详情')
}

const handleAdjustCredit = (row) => {
  adjustDialogVisible.value = true
  adjustForm.currentScore = row.creditScore
  adjustForm.adjustScore = 0
  adjustForm.reason = ''
}

const handleManagePolicy = (row) => {
  policyDialogVisible.value = true
  // 加载策略数据...
}

const handleAdjustSubmit = async () => {
  if (!adjustFormRef.value) return
  await adjustFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('调整成功')
      adjustDialogVisible.value = false
    }
  })
}

const handlePolicySubmit = () => {
  ElMessage.success('策略保存成功')
  policyDialogVisible.value = false
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.credit-overview {
  margin-bottom: 20px;
}

.credit-card {
  height: 120px;
  text-align: center;
  
  &.excellent {
    background: linear-gradient(135deg, #67C23A 0%, #95D475 100%);
  }
  
  &.good {
    background: linear-gradient(135deg, #409EFF 0%, #79BBFF 100%);
  }
  
  &.normal {
    background: linear-gradient(135deg, #E6A23C 0%, #F3D19E 100%);
  }
  
  &.poor {
    background: linear-gradient(135deg, #F56C6C 0%, #FAB6B6 100%);
  }
}

.credit-card-content {
  color: #fff;
}

.credit-level {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.credit-count {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.credit-range {
  font-size: 14px;
}

.search-card {
  margin-bottom: 20px;
  background-color: #fff;
}

.search-form {
  padding: 16px;
}

.search-input,
.search-select {
  width: 200px;
}

.score-dimensions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dimension-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dimension-label {
  width: 80px;
  color: #606266;
}

.dimension-score {
  width: 40px;
  text-align: right;
  color: #606266;
}

:deep(.el-progress) {
  width: 120px;
  margin: 0;
}

.score-excellent {
  color: #67C23A;
  font-weight: bold;
}

.score-good {
  color: #409EFF;
  font-weight: bold;
}

.score-normal {
  color: #E6A23C;
  font-weight: bold;
}

.score-poor {
  color: #F56C6C;
  font-weight: bold;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>