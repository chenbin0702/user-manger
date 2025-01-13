<template>
  <div class="article-categories">
    <div class="header">
      <h2>文章分类管理</h2>
      <div class="actions">
        <div class="search-bar">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索分类名称/编码"
            clearable
            @clear="handleSearch"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select 
            v-model="searchForm.status" 
            placeholder="状态"
            clearable
            class="search-select"
          >
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增分类
        </el-button>
      </div>
    </div>

    <el-table 
      :data="categories" 
      v-loading="loading"
      style="width: 100%"
      border
      row-key="id"
      :tree-props="{ children: 'children' }"
    >
    <!-- 序号 -->

      <el-table-column prop="id" label="序号" width="100" align="center" />
      <el-table-column prop="name" label="分类名称" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="category-name">
            <!-- <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon> -->
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="分类编码" min-width="150" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" width="100" align="center" />
      <el-table-column prop="articleCount" label="文章数量" width="100" align="center" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            link
            :type="row.status === '启用' ? 'warning' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === '启用' ? '禁用' : '启用' }}
          </el-button>
          <el-button 
            link
            type="danger" 
            @click="handleDelete(row)"
          >
            删除
          </el-button>
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

    <!-- 分类表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新增分类'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级分类">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryTree"
            placeholder="请选择上级分类"
            check-strictly
            :render-after-expand="false"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <icon-select v-model="form.icon" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="99" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            :active-value="'启用'"
            :inactive-value="'禁用'"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
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
import { ref, onMounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import IconSelect from '@/components/IconSelect/index.vue'

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '新闻资讯',
    code: 'news',
    icon: 'News',
    sort: 1,
    articleCount: 25,
    status: '启用',
    createTime: '2024-01-20 10:00:00',
    children: [
      {
        id: 11,
        name: '行业动态',
        code: 'news_industry',
        icon: 'Trend',
        sort: 1,
        articleCount: 15,
        status: '启用',
        createTime: '2024-01-20 10:30:00'
      },
      {
        id: 12,
        name: '政策解读',
        code: 'news_policy',
        icon: 'Document',
        sort: 2,
        articleCount: 10,
        status: '启用',
        createTime: '2024-01-20 11:00:00'
      }
    ]
  },
  {
    id: 2,
    name: '技术文章',
    code: 'tech',
    icon: 'Monitor',
    sort: 2,
    articleCount: 18,
    status: '启用',
    createTime: '2024-01-20 12:00:00'
  }
])

// 搜索表单
const searchForm = ref({
  keyword: '',
  status: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

// 表单相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = ref({
  parentId: null,
  name: '',
  code: '',
  icon: '',
  sort: 0,
  status: '启用',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[a-z][a-z0-9_]*$/, message: '编码只能包含小写字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' }
  ]
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

// 新增分类
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    parentId: null,
    name: '',
    code: '',
    icon: '',
    sort: 0,
    status: '启用',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

// 切换状态
const handleToggleStatus = (row) => {
  const action = row.status === '启用' ? '禁用' : '启用'
  ElMessageBox.confirm(
    `确定要${action}分类"${row.name}"吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    row.status = row.status === '启用' ? '禁用' : '启用'
    ElMessage.success(`${action}成功`)
  })
}

// 删除分类
const handleDelete = (row) => {
  if (row.children?.length) {
    ElMessage.warning('请先删除子分类')
    return
  }
  if (row.articleCount > 0) {
    ElMessage.warning('该分类下还有文章，不能删除')
    return
  }
  ElMessageBox.confirm(
    `确定要删除分类"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadData()
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

// 加载数据
const loadData = () => {
  loading.value = true
  try {
    // 这里模拟数据加载和过滤
    // 实际项目中应该调用API
    setTimeout(() => {
      const filteredData = categories.value.filter(item => {
        const matchKeyword = !searchForm.value.keyword || 
          item.name.toLowerCase().includes(searchForm.value.keyword.toLowerCase()) ||
          item.code.toLowerCase().includes(searchForm.value.keyword.toLowerCase())
        const matchStatus = !searchForm.value.status || 
          item.status === searchForm.value.status
        return matchKeyword && matchStatus
      })
      total.value = filteredData.length
      loading.value = false
    }, 300)
  } finally {
    loading.value = false
  }
}

// 获取分类树形数据（用于选择上级分类）
const categoryTree = ref([
  {
    id: 0,
    label: '顶级分类',
    children: categories.value.map(item => ({
      id: item.id,
      label: item.name,
      children: item.children?.map(child => ({
        id: child.id,
        label: child.name
      }))
    }))
  }
])

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.article-categories {
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
  width: 160px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-button--link) {
  padding: 4px 8px;
  font-size: 13px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>