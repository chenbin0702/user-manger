<template>
  <el-popover
    placement="bottom"
    :width="600"
    trigger="click"
  >
    <template #reference>
      <el-input 
        :model-value="modelValue"
        placeholder="点击选择图标"
        readonly
        size="default"
      >
        <template #prefix>
          <el-icon v-if="modelValue">
            <component :is="modelValue" />
          </el-icon>
          <el-icon v-else>
            <Picture />
          </el-icon>
        </template>
      </el-input>
    </template>
    <template #default>
      <div class="icon-selector">
        <div class="icon-search">
          <el-input 
            v-model="searchKey" 
            placeholder="搜索图标" 
            clearable
            size="default"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="icon-list">
          <div 
            v-for="icon in filteredIcons" 
            :key="icon"
            class="icon-item"
            @click="handleSelect(icon)"
          >
            <div class="icon-wrapper">
              <el-icon>
                <component :is="icon" />
              </el-icon>
            </div>
            <div class="icon-name">{{ icon }}</div>
          </div>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Picture } from '@element-plus/icons-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// 图标列表
const icons = ref(Object.keys(ElementPlusIconsVue).filter(key => key !== 'default'))

// 搜索关键字
const searchKey = ref('')

// 过滤后的图标列表
const filteredIcons = computed(() => {
  if (!searchKey.value) return icons.value
  return icons.value.filter(icon => 
    icon.toLowerCase().includes(searchKey.value.toLowerCase())
  )
})

// 处理图标选择
const handleSelect = (icon) => {
  emit('update:modelValue', icon)
}
</script>

<style scoped>
.icon-selector {
  height: 420px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background-color: #fff;
  border-radius: 4px;
}

.icon-search {
  margin-bottom: 8px;
}

.icon-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 8px;
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  height: 85px;
  border: 1px solid #eee;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 45px;
}

.icon-item .el-icon {
  font-size: 22px;
  color: #666;
  transition: transform 0.3s;
}

.icon-name {
  width: 100%;
  height: 28px;
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 14px;
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  padding: 0 2px;
}

.icon-item:hover {
  background-color: #f5f7fa;
  border-color: #409EFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  .el-icon {
    color: #409EFF;
    transform: scale(1.1);
  }
  .icon-name {
    color: #409EFF;
  }
}

:deep(.el-popover.el-popper) {
  padding: 0;
  min-width: 480px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409EFF inset;
}

/* 自定义滚动条样式 */
.icon-list::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.icon-list::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #c0c4cc;
}

.icon-list::-webkit-scrollbar-track {
  border-radius: 3px;
  background: #f5f7fa;
}
</style> 