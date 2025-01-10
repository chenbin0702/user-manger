```vue
<template>
  <el-tree
    ref="treeRef"
    :data="categories"
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    highlight-current>
    <template #default="{ node, data }">
      <div class="custom-tree-node">
        <span class="category-name">
          <el-icon v-if="data.children && data.children.length"><Folder /></el-icon>
          <el-icon v-else><Document /></el-icon>
          {{ data.name }}
        </span>
        <span class="category-actions">
          <el-button 
            link 
            type="primary" 
            @click="handleEdit(data)">
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleAddChild(data)">
            添加子分类
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(node, data)"
            :disabled="data.children && data.children.length > 0">
            删除
          </el-button>
        </span>
      </div>
    </template>
  </el-tree>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { Folder, Document } from '@element-plus/icons-vue'

defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'add-child', 'delete'])
const treeRef = ref(null)

const handleEdit = (data) => {
  emit('edit', data)
}

const handleAddChild = (data) => {
  emit('add-child', data)
}

const handleDelete = (node, data) => {
  emit('delete', data)
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  width: 100%;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.category-actions {
  display: none;
  gap: 8px;
}

.custom-tree-node:hover .category-actions {
  display: flex;
}
</style>
```