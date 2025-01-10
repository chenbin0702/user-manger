<template>
  <div class="sidebar">
    <!-- 添加系统标题 -->
    <div class="logo-container">
      <LogoIcon />
      <div v-if="!isCollapse" class="logo-title">
        <div class="title-main">低空经济管理系统</div>
        <div class="title-sub">运营端</div>
      </div>
    </div>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      background-color="#001529"
      text-color="#ffffff"
      active-text-color="#409EFF"
      router
      class="sidebar-menu"
      :unique-opened="true">
      
      <el-sub-menu index="1">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        
        <el-sub-menu index="1-1">
          <template #title>账户管理</template>
          <el-menu-item index="/users">用户列表</el-menu-item>
          <el-menu-item index="/roles">角色配置</el-menu-item>
          <el-menu-item index="/permissions">权限设置</el-menu-item>
        </el-sub-menu>
  
        <el-sub-menu index="1-2">
          <template #title>认证管理</template>
          <el-menu-item index="/identity-verification">实名认证审核</el-menu-item>
          <el-menu-item index="/pilot-qualification">飞手资质审核</el-menu-item>
          <el-menu-item index="/certificate-management">证书管理</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
  
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Box /></el-icon>
          <span>设备管理</span>
        </template>
        <el-menu-item index="/equipment/categories">设备分类</el-menu-item>
        <el-menu-item index="/equipment/list">设备列表</el-menu-item>
        <el-menu-item index="/equipment/inventory">库存管理</el-menu-item>
      </el-sub-menu>
  
      <el-sub-menu index="3">
        <template #title>
          <el-icon><Tickets /></el-icon>
          <span>租赁管理</span>
        </template>
        <el-menu-item index="/rental/orders">租赁订单</el-menu-item>
        <el-menu-item index="/rental/rules">租赁规则</el-menu-item>
        <el-menu-item index="/rental/deposits">押金管理</el-menu-item>
      </el-sub-menu>
  
      <el-sub-menu index="4">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/orders">订单列表</el-menu-item>
        <el-menu-item index="/orders/statistics">订单统计</el-menu-item>
        <el-menu-item index="/orders/categories">订单分类</el-menu-item>
        <el-sub-menu index="4-1">
          <template #title>培训订单</template>
          <el-menu-item index="/orders/training/course">课程订单</el-menu-item>
          <el-menu-item index="/orders/training/certificate">考证订单</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4-2">
          <template #title>保险订单</template>
          <el-menu-item index="/orders/insurance/policy">保单管理</el-menu-item>
          <el-menu-item index="/orders/insurance/claims">理赔管理</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
  
      <el-sub-menu index="5">
        <template #title>
          <el-icon><Reading /></el-icon>
          <span>内容管理</span>
        </template>
        <el-sub-menu index="5-1">
          <template #title>课程管理</template>
          <el-menu-item index="/content/course/categories">课程分类</el-menu-item>
          <el-menu-item index="/content/course/list">课程列表</el-menu-item>
          <el-menu-item index="/content/course/teachers">讲师管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5-2">
          <template #title>广告管理</template>
          <el-menu-item index="/content/ad/positions">广告位管理</el-menu-item>
          <el-menu-item index="/content/ad/list">广告内容</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5-3">
          <template #title>资讯管理</template>
          <el-menu-item index="/content/article/categories">文章分类</el-menu-item>
          <el-menu-item index="/content/article/list">文章列表</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
  
      <el-sub-menu index="6">
        <template #title>
          <el-icon><TrendCharts /></el-icon>
          <span>数据统计</span>
        </template>
        <el-sub-menu index="6-1">
          <template #title>运营数据</template>
          <el-menu-item index="/statistics/operation/users">用户分析</el-menu-item>
          <el-menu-item index="/statistics/operation/orders">订单分析</el-menu-item>
          <el-menu-item index="/statistics/operation/revenue">收入统计</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="6-2">
          <template #title>设备数据</template>
          <el-menu-item index="/statistics/equipment/usage">使用率分析</el-menu-item>
          <el-menu-item index="/statistics/equipment/failure">故障率统计</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="6-3">
          <template #title>飞手数据</template>
          <el-menu-item index="/statistics/pilot/orders">接单统计</el-menu-item>
          <el-menu-item index="/statistics/pilot/ratings">评分分析</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </div>
</template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { 
    User, 
    Box, 
    Tickets, 
    Document, 
    Reading, 
    Fold,
    Expand,
    TrendCharts,
  } from '@element-plus/icons-vue'
  import LogoIcon from '@/components/icons/LogoIcon.vue'
  
  const props = defineProps({
    isCollapse: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:isCollapse'])
  
  const toggleCollapse = () => {
    emit('update:isCollapse', !props.isCollapse)
  }
  
  const route = useRoute()
  const activeMenu = computed(() => route.path)
  </script>
  
  <style scoped>
  .sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #001529;
  }
  
  .logo-container {
    height: 60px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    white-space: nowrap;
    background-color: #001529;
  }
  
  .logo-icon {
    color: #409EFF;
    flex-shrink: 0;
  }
  
  .logo-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2;
  }
  
  .title-main {
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
  }
  
  .title-sub {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    margin-top: 2px;
  }
  
  .sidebar-menu {
    flex: 1;
    border-right: none;
    overflow-y: auto;
  }
  
  /* 滚动条样式 */
  .sidebar-menu::-webkit-scrollbar {
    width: 6px;
  }
  
  .sidebar-menu::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  
  .sidebar-menu::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  /* 一级菜单样式 */
  :deep(.el-sub-menu__title) {
    padding-left: 20px !important;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff !important;
    height: 40px !important;
    line-height: 40px !important;
  }
  
  /* 一级菜单项样式 */
  :deep(.el-menu-item) {
    padding-left: 20px !important;
    font-size: 13px;
    color: #ffffff !important;
    height: 40px !important;
    line-height: 40px !important;
  }
  
  /* 二级菜单容器 */
  :deep(.el-menu--inline) {
    background-color: #001529 !important;
  }
  
  /* 二级菜单标题 */
  :deep(.el-menu--inline .el-sub-menu__title) {
    padding-left: 44px !important;
    font-size: 13px;
    color: #ffffff !important;
    background-color: #001529 !important;
  }
  
  /* 二级菜单项 */
  :deep(.el-menu--inline .el-menu-item) {
    padding-left: 44px !important;
    font-size: 13px;
    background-color: #001529 !important;
  }
  
  /* 三级菜单容器 */
  :deep(.el-menu--inline .el-menu--inline) {
    background-color: #001529 !important;
  }
  
  /* 三级菜单项 */
  :deep(.el-menu--inline .el-menu--inline .el-menu-item) {
    padding-left: 68px !important;
    background-color: #001529 !important;
  }
  
  /* 悬停效果 */
  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background-color: #1a2d3d !important;
  }
  
  /* 激活状态 */
  :deep(.el-menu-item.is-active) {
    background-color: #409eff !important;
    color: #ffffff !important;
    position: relative;
    font-weight: 500;
  }
  
  /* 激活状态的图标和文字颜色 */
  :deep(.el-menu-item.is-active .el-icon),
  :deep(.el-menu-item.is-active) {
    color: #ffffff !important;
  }
  
  /* 修复折叠时激活菜单的样式 */
  :deep(.el-menu--popup) {
    .el-menu-item.is-active {
      background-color: #409eff !important;
      color: #ffffff !important;
    }
    .el-menu-item {
      padding-left: 20px !important;
    }
  }
  
  /* 修复三级菜单激活状态 */
  :deep(.el-menu--inline .el-menu--inline .el-menu-item.is-active) {
    background-color: #409eff !important;
    color: #ffffff !important;
  }
  
  /* 确保三级菜单激活时图标颜色也改变 */
  :deep(.el-menu--inline .el-menu--inline .el-menu-item.is-active .el-icon) {
    color: #ffffff !important;
  }
  
  /* 图标样式 */
  :deep(.el-icon) {
    color: #ffffff !important;
    margin-right: 10px;
    font-size: 16px;
    vertical-align: middle;
  }
  
  /* 添加缩进指示线 */
  :deep(.el-menu--inline) {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: 34px;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  
  /* 折叠时的样式调整 */
  .el-menu--collapse {
    :deep(.el-sub-menu__title) {
      padding-left: 20px !important;
    }
  }
  </style>