<template>
  <el-menu
    class="sidebar-menu"
    :default-active="activeMenu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    
    <el-sub-menu index="1">
      <template #title>
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </template>
      
      <el-sub-menu index="1-1">
        <template #title>账户管理</template>
        <el-menu-item index="1-1-1">用户列表</el-menu-item>
        <el-menu-item index="1-1-2">角色配置</el-menu-item>
        <el-menu-item index="1-1-3">权限设置</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'

const activeMenu = ref('1-1-1')
</script>

<style scoped>
.sidebar-menu {
  height: 100vh;
  width: 200px;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>