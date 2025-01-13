<template>
  <div class="ad-positions">
    <div class="header">
      <h2>广告位管理</h2>
      <div class="actions">
        <div class="search-bar">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索广告位名称/编号"
            clearable
            @clear="handleSearch"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select 
            v-model="searchForm.type" 
            placeholder="广告位类型"
            clearable
            class="search-select"
          >
            <el-option label="首页轮播" value="home_banner" />
            <el-option label="首页推荐" value="home_recommend" />
            <el-option label="分类页广告" value="category_ad" />
            <el-option label="详情页广告" value="detail_ad" />
          </el-select>
          <el-select 
            v-model="searchForm.status" 
            placeholder="状态"
            clearable
            class="search-select"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增广告位
        </el-button>
      </div>
    </div>

    <el-table 
      :data="positionList" 
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column prop="code" label="编号" min-width="120" />
      <el-table-column prop="name" label="广告位名称" min-width="150" />
      <el-table-column prop="type" label="类型" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">
            {{ getTypeName(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="尺寸规格" min-width="120">
        <template #default="{ row }">
          {{ row.width }}x{{ row.height }}
        </template>
      </el-table-column>
      <el-table-column prop="maxCount" label="最大数量" width="100" align="center" />
      <el-table-column prop="price" label="刊登价格" min-width="120">
        <template #default="{ row }">
          ¥{{ row.price }}/天
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handlePreview(row)">预览</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 广告位表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑广告位' : '新增广告位'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="广告位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入广告位名称" />
        </el-form-item>
        <el-form-item label="广告位类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择广告位类型" style="width: 100%">
            <el-option label="首页轮播" value="home_banner" />
            <el-option label="首页推荐" value="home_recommend" />
            <el-option label="分类页广告" value="category_ad" />
            <el-option label="详情页广告" value="detail_ad" />
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸规格">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item prop="width">
                <el-input-number v-model="form.width" :min="1" placeholder="宽度" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="2" class="text-center">
              <span>x</span>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="height">
                <el-input-number v-model="form.height" :min="1" placeholder="高度" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="最大数量" prop="maxCount">
          <el-input-number v-model="form.maxCount" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="刊登价格" prop="price">
          <el-input-number 
            v-model="form.price" 
            :min="0" 
            :precision="2" 
            :step="100"
            style="width: 100%"
          >
            <template #append>元/天</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入广告位描述"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = ref({
  keyword: '',
  type: '',
  status: ''
})

// 表格数据
const positionList = ref([
  {
    id: 1,
    code: 'AD001',
    name: '首页顶部轮播',
    type: 'home_banner',
    width: 1920,
    height: 400,
    maxCount: 5,
    price: 1000,
    description: '网站首页顶部轮播广告位，展示效果好',
    status: 1
  },
  {
    id: 2,
    code: 'AD002',
    name: '首页推荐位',
    type: 'home_recommend',
    width: 300,
    height: 200,
    maxCount: 4,
    price: 500,
    description: '首页核心区域推荐位置',
    status: 1
  },
  {
    id: 3,
    code: 'AD003',
    name: '分类页侧边栏',
    type: 'category_ad',
    width: 250,
    height: 300,
    maxCount: 2,
    price: 300,
    description: '分类页侧边广告位',
    status: 0
  }
])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表单数据
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = ref({
  name: '',
  type: '',
  width: 0,
  height: 0,
  maxCount: 1,
  price: 0,
  description: '',
  status: 1
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入广告位名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择广告位类型', trigger: 'change' }
  ],
  width: [
    { required: true, message: '请输入宽度', trigger: 'blur' }
  ],
  height: [
    { required: true, message: '请输入高度', trigger: 'blur' }
  ],
  maxCount: [
    { required: true, message: '请输入最大数量', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入刊登价格', trigger: 'blur' }
  ]
}

// 获取类型标签样式
const getTypeTag = (type) => {
  const map = {
    home_banner: '',
    home_recommend: 'success',
    category_ad: 'warning',
    detail_ad: 'info'
  }
  return map[type]
}

// 获取类型名称
const getTypeName = (type) => {
  const map = {
    home_banner: '首页轮播',
    home_recommend: '首页推荐',
    category_ad: '分类页广告',
    detail_ad: '详情页广告'
  }
  return map[type]
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    type: '',
    status: ''
  }
  handleSearch()
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

// 处理新增
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    name: '',
    type: '',
    width: 0,
    height: 0,
    maxCount: 1,
    price: 0,
    description: '',
    status: 1
  }
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 处理预览
const handlePreview = (row) => {
  ElMessage.info('预览功能开发中...')
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认要删除广告位"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = positionList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      positionList.value.splice(index, 1)
      ElMessage.success('删除成功')
      loadData()
    }
  })
}

// 处理状态变更
const handleStatusChange = (row) => {
  const action = row.status === 1 ? '启用' : '禁用'
  ElMessage.success(`${action}成功`)
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        // 更新
        const index = positionList.value.findIndex(item => item.id === form.value.id)
        if (index !== -1) {
          positionList.value[index] = { ...form.value }
        }
        ElMessage.success('更新成功')
      } else {
        // 新增
        positionList.value.push({
          id: Date.now(),
          code: `AD${String(Date.now()).slice(-3)}`,
          ...form.value
        })
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    }
  })
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 保存原始列表用于分页
    const originalList = [...positionList.value]
    
    // 过滤数据
    let filteredList = originalList
    
    if (searchForm.value.keyword) {
      const keyword = searchForm.value.keyword.toLowerCase()
      filteredList = filteredList.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      )
    }
    
    if (searchForm.value.type) {
      filteredList = filteredList.filter(item => 
        item.type === searchForm.value.type
      )
    }
    
    if (searchForm.value.status !== '') {
      filteredList = filteredList.filter(item => 
        item.status === searchForm.value.status
      )
    }
    
    // 计算分页
    total.value = filteredList.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    positionList.value = filteredList.slice(start, end)
  } catch (error) {
    ElMessage.error('获取广告位列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.ad-positions {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-weight: 500;
    color: #303133;
  }
}

.actions {
  display: flex;
  gap: 16px;
}

.search-bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 220px;
}

.search-select {
  width: 180px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.text-center {
  text-align: center;
  line-height: 32px;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
  --el-table-row-hover-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  font-weight: 600;
  color: #303133;
  background-color: #f5f7fa;
}

:deep(.el-table td) {
  padding: 8px 0;
}

:deep(.el-button--link) {
  padding: 4px 8px;
  font-size: 13px;
}

:deep(.el-tag) {
  border-radius: 4px;
}
</style> 