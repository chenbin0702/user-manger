```vue
<template>
  <div class="category-management">
    <div class="header">
      <div class="title-section">
        <h2>设备分类</h2>
        <el-tag type="info" class="category-count">
          共 {{ totalCategories }} 个分类
        </el-tag>
      </div>
      <div class="action-section">
        <el-button type="primary" @click="handleAddTopLevel">
          <el-icon><Plus /></el-icon>新增顶级分类
        </el-button>
      </div>
    </div>

    <el-card class="category-tree-card">
      <template #header>
        <div class="card-header">
          <span>分类树形结构</span>
        </div>
      </template>
      
      <category-tree
        :categories="categories"
        @edit="handleEdit"
        @add-child="handleAddChild"
        @delete="handleDelete"
      />
    </el-card>

    <category-form
      v-model:visible="formVisible"
      :is-edit="isEdit"
      :parent-category="currentParent"
      :category-data="currentCategory"
      :category-options="categories"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CategoryTree, CategoryForm } from '@/components/equipment'
import { equipmentService } from '@/services/equipmentService'

const categories = ref([])
const formVisible = ref(false)
const isEdit = ref(false)
const currentCategory = ref({})
const currentParent = ref(null)

const totalCategories = computed(() => {
  let count = 0
  const countCategories = (items) => {
    items.forEach(item => {
      count++
      if (item.children) {
        countCategories(item.children)
      }
    })
  }
  countCategories(categories.value)
  return count
})

const loadCategories = async () => {
  try {
    categories.value = await equipmentService.getCategories()
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

const handleAddTopLevel = () => {
  isEdit.value = false
  currentParent.value = null
  currentCategory.value = {}
  formVisible.value = true
}

const handleAddChild = (parentCategory) => {
  isEdit.value = false
  currentParent.value = parentCategory
  currentCategory.value = {}
  formVisible.value = true
}

const handleEdit = (category) => {
  isEdit.value = true
  currentCategory.value = { ...category }
  currentParent.value = null
  formVisible.value = true
}

const handleDelete = async (category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${category.name}" 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await equipmentService.deleteCategory(category.id)
    ElMessage.success('删除成功')
    loadCategories()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleFormSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      await equipmentService.updateCategory(currentCategory.value.id, formData)
      ElMessage.success('更新成功')
    } else {
      await equipmentService.createCategory(formData)
      ElMessage.success('创建成功')
    }
    loadCategories()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-count {
  font-size: 13px;
}

.action-section {
  display: flex;
  gap: 16px;
}

.category-tree-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
```