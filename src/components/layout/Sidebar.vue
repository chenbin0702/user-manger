<template>
  <el-scrollbar>
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#ffd04b"
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
  </el-scrollbar>
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
  TrendCharts 
} from '@element-plus/icons-vue'

defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar-menu {
  height: calc(100vh - 50px);
  border-right: none;
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu--collapse {
  width: 64px;
}

:deep(.el-sub-menu__title) {
  padding-left: 20px !important;
}

:deep(.el-menu-item) {
  padding-left: 40px !important;
}

:deep(.el-menu--collapse .el-sub-menu__title) {
  padding-left: 20px !important;
}

:deep(.el-menu--collapse .el-menu-item) {
  padding-left: 20px !important;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden !important;
}

:deep(.el-menu--vertical:not(.el-menu--collapse) .el-menu-item) {
  padding-left: 40px !important;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
}
</style>