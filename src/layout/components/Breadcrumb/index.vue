<template>
  <div class="breadcrumb-wrapper">
    <!-- 原有的面包屑 -->
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <template v-if="route.meta?.parentTitles">
          <el-breadcrumb-item 
            v-for="(title, index) in route.meta.parentTitles" 
            :key="index"
            :to="{ path: route.meta.parentPaths[index] }"
          >
            {{ title }}
          </el-breadcrumb-item>
        </template>
        <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentTitle = computed(() => route.meta?.title || '')

// 访问过的页面记录
const visitedViews = ref([])

// 添加访问记录
const addVisitedView = (view) => {
  if (visitedViews.value.some(v => v.path === view.path)) return
  visitedViews.value.push({
    name: view.name,
    path: view.path,
    title: view.meta?.title || 'unknown'
  })
}

// 判断是否是当前激活的页面
const isActive = (tag) => {
  return tag.path === route.path
}

// 处理标签点击
const handleClick = (tag) => {
  router.push(tag.path)
}

// 处理标签关闭
const handleClose = (view) => {
  const index = visitedViews.value.indexOf(view)
  if (index > -1) {
    visitedViews.value.splice(index, 1)
  }
  
  // 如果关闭的是当前页面，则跳转到最后一个标签
  if (isActive(view) && visitedViews.value.length) {
    const latestView = visitedViews.value[visitedViews.value.length - 1]
    router.push(latestView.path)
  }
}

// 监听路由变化，添加访问记录
watch(
  () => route.path,
  () => {
    addVisitedView(route)
  },
  {
    immediate: true
  }
)
</script>

<style scoped>
.breadcrumb-wrapper {
  display: flex;
  flex-direction: column;
}

.breadcrumb-container {
  padding: 8px 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.tags-nav {
  position: relative;
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.tags-scrollbar {
  width: 100%;
  height: 100%;
}

.tags-wrapper {
  padding: 4px;
  height: 34px;
  white-space: nowrap;
}

:deep(.el-tag) {
  margin-right: 4px;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  padding: 0 8px;
  font-size: 12px;
  border-radius: 2px;
  border: 1px solid #e8eaec;
  color: #515a6e;
  background: #fff;
  transition: all .3s ease;
  
  &.active {
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    
    .el-tag__close {
      color: #fff;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        color: #fff;
      }
    }
  }
  
  &:not(.active) {
    &:hover {
      color: #409EFF;
      border-color: #409EFF;
      background-color: #f5f7fa;
    }
    
    .el-tag__close {
      color: #999;
      
      &:hover {
        background-color: #f5f7fa;
        color: #666;
      }
    }
  }
}

:deep(.el-tag__close) {
  position: relative;
  top: -1px;
  margin-left: 6px;
  border-radius: 50%;
  transition: all .3s ease;
}

:deep(.el-breadcrumb) {
  font-size: 14px;
  line-height: 1;
}

:deep(.el-breadcrumb__item) {
  .el-breadcrumb__inner {
    color: #606266;
    font-weight: normal;
    
    &.is-link {
      color: #606266;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
  }
  
  &:last-child .el-breadcrumb__inner {
    color: #909399;
    cursor: text;
  }
}

:deep(.el-breadcrumb__separator) {
  margin: 0 8px;
  color: #909399;
}

:deep(.el-scrollbar__wrap) {
  height: 100%;
}

:deep(.el-scrollbar__bar) {
  z-index: 1;
  
  &.is-horizontal {
    height: 4px;
  }
  
  &.is-vertical {
    width: 4px;
  }
}
</style> 