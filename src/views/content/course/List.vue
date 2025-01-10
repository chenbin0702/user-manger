<template>
  <div class="course-list">
    <div class="header">
      <h2>课程列表</h2>
      <div class="actions">
        <div class="search-bar">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索课程名称"
            clearable
            class="search-input">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="searchForm.category" placeholder="课程分类" clearable>
            <el-option label="无人机驾驶" value="无人机驾驶" />
            <el-option label="无人机维修" value="无人机维修" />
            <el-option label="航拍技术" value="航拍技术" />
          </el-select>
          <el-select v-model="searchForm.status" placeholder="上架状态" clearable>
            <el-option label="已上架" value="已上架" />
            <el-option label="已下架" value="已下架" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增课程
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总课程数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.totalCourses }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>学习人数</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.totalStudents }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>平均完成率</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.avgCompletionRate }}%</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>平均评分</span>
            </div>
          </template>
          <div class="card-content">{{ statistics.avgRating }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>学习人数趋势</span>
            </div>
          </template>
          <div ref="trendChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>评分分布</span>
            </div>
          </template>
          <div ref="ratingChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 课程列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>课程列表</span>
          <div class="batch-actions">
            <el-button 
              type="primary" 
              :disabled="!selectedCourses.length"
              @click="handleBatchPublish">
              批量上架
            </el-button>
            <el-button 
              type="warning"
              :disabled="!selectedCourses.length"
              @click="handleBatchUnpublish">
              批量下架
            </el-button>
          </div>
        </div>
      </template>

      <el-table 
        :data="courses" 
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="封面" width="120">
          <template #default="{ row }">
            <el-image
              :src="row.coverUrl"
              :preview-src-list="[row.coverUrl]"
              fit="cover"
              class="course-cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="课程名称" width="200" show-overflow-tooltip />
        <el-table-column prop="description" label="课程简介" width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip 
              :content="row.description" 
              placement="top" 
              :show-after="500">
              <span>{{ row.description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="teacher" label="讲师" width="120" />
        <el-table-column prop="duration" label="课程时长" width="120">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            ¥{{ formatAmount(row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" width="120">
          <template #default="{ row }">
            <el-rate
              v-model="row.rating"
              disabled
              show-score
              text-color="#ff9900"
            />
          </template>
        </el-table-column>
        <el-table-column prop="studentCount" label="学习人数" width="100" />
        <el-table-column prop="progress" label="平均进度" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已上架' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status === '已上架' ? 'warning' : 'success'"
              @click="handleToggleStatus(row)">
              {{ row.status === '已上架' ? '下架' : '上架' }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)">
              删除
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

    <!-- 课程表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑课程' : '新增课程'"
      width="800px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="课程分类" prop="category">
          <el-select v-model="form.category" style="width: 100%">
            <el-option label="无人机驾驶" value="无人机驾驶" />
            <el-option label="无人机维修" value="无人机维修" />
            <el-option label="航拍技术" value="航拍技术" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3" />
        </el-form-item>
        <el-form-item label="讲师" prop="teacher">
          <el-select v-model="form.teacher" style="width: 100%">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程时长" prop="duration">
          <el-input-number 
            v-model="form.duration"
            :min="0"
            :step="10"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="课程价格" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="10"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="封面图片" prop="coverUrl">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload">
            <img v-if="form.coverUrl" :src="form.coverUrl" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="'已上架'"
            :inactive-value="'已下架'"
          />
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
import { ref, onMounted, onUnmounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { formatAmount } from '@/utils/format'

// 搜索表单
const searchForm = ref({
  keyword: '',
  category: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 统计数据
const statistics = ref({
  totalCourses: 156,
  totalStudents: 2580,
  avgCompletionRate: 85,
  avgRating: 4.5
})

// 课程数据
const courses = ref([
  {
    id: 1,
    name: '无人机驾驶基础课程',
    description: '适合零基础学员的无人机驾驶入门课程',
    category: '无人机驾驶',
    teacher: '张三',
    duration: 120,
    price: 1999.00,
    coverUrl: 'https://example.com/course1.jpg',
    rating: 4.5,
    studentCount: 156,
    progress: 85,
    status: '已上架'
  }
])

// 选中的课程
const selectedCourses = ref([])

// 图表引用
const trendChartRef = ref(null)
const ratingChartRef = ref(null)
let trendChart = null
let ratingChart = null

// 表单相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = ref({
  name: '',
  category: '',
  description: '',
  teacher: '',
  duration: 0,
  price: 0,
  coverUrl: '',
  status: '已下架'
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择课程分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入课程简介', trigger: 'blur' }],
  teacher: [{ required: true, message: '请选择讲师', trigger: 'change' }],
  duration: [{ required: true, message: '请输入课程时长', trigger: 'blur' }],
  price: [{ required: true, message: '请输入课程价格', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '请上传课程封面', trigger: 'change' }]
}

// 格式化课程时长
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}小时${mins}分钟`
}

// 初始化图表
const initCharts = () => {
  // 学习人数趋势图
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const months = ['1月', '2月', '3月', '4月', '5月', '6月']
    trendChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '学习人数',
          type: 'line',
          smooth: true,
          data: [150, 200, 180, 250, 220, 300]
        }
      ]
    })
  }

  // 评分分布图
  if (ratingChartRef.value) {
    ratingChart = echarts.init(ratingChartRef.value)
    ratingChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 50, name: '5星' },
            { value: 30, name: '4星' },
            { value: 15, name: '3星' },
            { value: 3, name: '2星' },
            { value: 2, name: '1星' }
          ]
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

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    category: '',
    status: ''
  }
  handleSearch()
}

// 选择处理
const handleSelectionChange = (selection) => {
  selectedCourses.value = selection
}

// 批量上架
const handleBatchPublish = () => {
  ElMessageBox.confirm(
    `确定要上架选中的 ${selectedCourses.value.length} 个课程吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现批量上架逻辑
    ElMessage.success('批量上架成功')
    loadData()
  })
}

// 批量下架
const handleBatchUnpublish = () => {
  ElMessageBox.confirm(
    `确定要下架选中的 ${selectedCourses.value.length} 个课程吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现批量下架逻辑
    ElMessage.success('批量下架成功')
    loadData()
  })
}

// 新增课程
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    category: '',
    description: '',
    teacher: '',
    duration: 0,
    price: 0,
    coverUrl: '',
    status: '已下架'
  }
  dialogVisible.value = true
}

// 编辑课程
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = (row) => {
  const action = row.status === '已上架' ? '下架' : '上架'
  ElMessageBox.confirm(
    `确定要${action}课程 "${row.name}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现状态切换逻辑
    ElMessage.success(`${action}成功`)
    loadData()
  })
}

// 删除课程
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除课程 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
    loadData()
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 实现保存逻辑
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

// 封面上传相关
const handleCoverSuccess = (response) => {
  form.value.coverUrl = response.url
}

const beforeCoverUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }

  return isImage && isLt2M
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
  if (ratingChart) ratingChart.dispose()
})

const handleResize = () => {
  if (trendChart) trendChart.resize()
  if (ratingChart) ratingChart.resize()
}
</script>

<style scoped>
.course-list {
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

.search-bar {
  display: flex;
  gap: 10px;
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

.table-card {
  margin-bottom: 20px;
}

.course-cover {
  width: 80px;
  height: 60px;
  border-radius: 4px;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.cover-uploader:hover {
  border-color: #409EFF;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
}

.cover {
  width: 120px;
  height: 120px;
  display: block;
}

.batch-actions {
  display: flex;
  gap: 10px;
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