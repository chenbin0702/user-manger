<template>
  <div class="role-config">
    <div class="header">
      <h2>角色配置</h2>
      <div class="actions">
        <div class="search-bar">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索角色名称/描述"
            clearable
            @clear="handleSearch"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAddRole">新建角色</el-button>
      </div>
    </div>

    <el-table 
      :data="roles" 
      style="width: 100%"
      v-loading="loading"
      border
    >
      <el-table-column prop="id" label="角色ID" width="100" />
      <el-table-column prop="name" label="角色名称" width="150" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEditRole(row)">编辑</el-button>
          <el-button 
            link
            type="success" 
            @click="handleConfigPermissions(row)">
            配置权限
          </el-button>
          <el-button 
            link
            type="danger" 
            @click="handleDeleteRole(row)"
            :disabled="row.id === 1">
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

    <!-- 角色表单 -->
    <role-form
      v-model:visible="roleFormVisible"
      :is-edit="isEdit"
      :role-data="currentRole"
      @submit="handleRoleSubmit"
    />

    <!-- 权限配置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="配置权限"
      width="600px">
      <div v-if="currentRole.id">
        <h3 class="permission-title">{{ currentRole.name }} - 权限配置</h3>
        <permission-tree
          :permissions="permissions"
          v-model:checkedKeys="checkedPermissions"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePermissions">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import RoleForm from '@/components/role/RoleForm.vue'
import PermissionTree from '@/components/role/PermissionTree.vue'
import { roleService } from '@/services/roleService'

const roles = ref([
  {
    id: 1,
    name: '超级管理员',
    description: '系统最高权限角色',
    createTime: '2023-07-20 10:00:00'
  },
  {
    id: 2,
    name: '运营管理员',
    description: '负责日常运营管理',
    createTime: '2023-07-21 11:00:00'
  },
  {
    id: 3,
    name: '飞手',
    description: '执飞任务人员',
    createTime: '2023-07-22 14:00:00'
  }
])
const loading = ref(false)
const searchForm = ref({
  keyword: ''
})
const permissions = ref([
  {
    id: 1,
    name: '仪表盘',
    icon: 'Odometer',
    path: '/dashboard',
    type: 'menu',
    permission: 'dashboard'
  },
  {
    id: 2,
    name: '用户管理',
    icon: 'User',
    path: '/user',
    type: 'menu',
    permission: 'user',
    children: [
      {
        id: 21,
        name: '账户管理',
        path: '/user/account',
        type: 'menu',
        permission: 'user:account',
        children: [
          {
            id: 211,
            name: '用户列表',
            path: '/user/account/list',
            type: 'menu',
            permission: 'user:account:list'
          },
          {
            id: 212,
            name: '角色配置',
            path: '/user/account/roles',
            type: 'menu',
            permission: 'user:account:roles'
          }
        ]
      },
      {
        id: 22,
        name: '认证管理',
        path: '/user/auth',
        type: 'menu',
        permission: 'user:auth',
        children: [
          {
            id: 221,
            name: '实名认证审核',
            path: '/user/auth/identity',
            type: 'menu',
            permission: 'user:auth:identity'
          },
          {
            id: 222,
            name: '飞手资质审核',
            path: '/user/auth/pilot',
            type: 'menu',
            permission: 'user:auth:pilot'
          },
          {
            id: 223,
            name: '证书管理',
            path: '/user/auth/certificate',
            type: 'menu',
            permission: 'user:auth:certificate'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '设备管理',
    icon: 'Box',
    path: '/equipment',
    type: 'menu',
    permission: 'equipment',
    children: [
      {
        id: 31,
        name: '设备分类',
        path: '/equipment/categories',
        type: 'menu',
        permission: 'equipment:categories'
      },
      {
        id: 32,
        name: '设备列表',
        path: '/equipment/list',
        type: 'menu',
        permission: 'equipment:list'
      },
      {
        id: 33,
        name: '库存管理',
        path: '/equipment/inventory',
        type: 'menu',
        permission: 'equipment:inventory'
      }
    ]
  },
  {
    id: 4,
    name: '租赁管理',
    icon: 'Tickets',
    path: '/rental',
    type: 'menu',
    permission: 'rental',
    children: [
      {
        id: 41,
        name: '租赁订单',
        path: '/rental/orders',
        type: 'menu',
        permission: 'rental:orders'
      },
      {
        id: 42,
        name: '租赁规则',
        path: '/rental/rules',
        type: 'menu',
        permission: 'rental:rules'
      },
      {
        id: 43,
        name: '押金管理',
        path: '/rental/deposits',
        type: 'menu',
        permission: 'rental:deposits'
      }
    ]
  },
  {
    id: 5,
    name: '订单管理',
    icon: 'Document',
    path: '/order',
    type: 'menu',
    permission: 'order',
    children: [
      {
        id: 51,
        name: '订单列表',
        path: '/order/list',
        type: 'menu',
        permission: 'order:list'
      },
      {
        id: 52,
        name: '订单统计',
        path: '/order/statistics',
        type: 'menu',
        permission: 'order:statistics'
      },
      {
        id: 53,
        name: '订单分类',
        path: '/order/categories',
        type: 'menu',
        permission: 'order:categories'
      },
      {
        id: 54,
        name: '培训订单',
        path: '/order/training',
        type: 'menu',
        permission: 'order:training',
        children: [
          {
            id: 541,
            name: '课程订单',
            path: '/order/training/course',
            type: 'menu',
            permission: 'order:training:course'
          },
          {
            id: 542,
            name: '考证订单',
            path: '/order/training/certificate',
            type: 'menu',
            permission: 'order:training:certificate'
          }
        ]
      },
      {
        id: 55,
        name: '保险订单',
        path: '/order/insurance',
        type: 'menu',
        permission: 'order:insurance',
        children: [
          {
            id: 551,
            name: '保单管理',
            path: '/order/insurance/policy',
            type: 'menu',
            permission: 'order:insurance:policy'
          },
          {
            id: 552,
            name: '理赔管理',
            path: '/order/insurance/claims',
            type: 'menu',
            permission: 'order:insurance:claims'
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: '内容管理',
    icon: 'Reading',
    path: '/content',
    type: 'menu',
    permission: 'content',
    children: [
      {
        id: 61,
        name: '课程管理',
        path: '/content/course',
        type: 'menu',
        permission: 'content:course',
        children: [
          {
            id: 611,
            name: '课程分类',
            path: '/content/course/categories',
            type: 'menu',
            permission: 'content:course:categories'
          },
          {
            id: 612,
            name: '课程列表',
            path: '/content/course/list',
            type: 'menu',
            permission: 'content:course:list'
          },
          {
            id: 613,
            name: '讲师管理',
            path: '/content/course/teachers',
            type: 'menu',
            permission: 'content:course:teachers'
          }
        ]
      },
      {
        id: 62,
        name: '广告管理',
        path: '/content/ad',
        type: 'menu',
        permission: 'content:ad',
        children: [
          {
            id: 621,
            name: '广告位管理',
            path: '/content/ad/positions',
            type: 'menu',
            permission: 'content:ad:positions'
          },
          {
            id: 622,
            name: '广告内容',
            path: '/content/ad/list',
            type: 'menu',
            permission: 'content:ad:list'
          }
        ]
      },
      {
        id: 63,
        name: '资讯管理',
        path: '/content/article',
        type: 'menu',
        permission: 'content:article',
        children: [
          {
            id: 631,
            name: '文章分类',
            path: '/content/article/categories',
            type: 'menu',
            permission: 'content:article:categories'
          },
          {
            id: 632,
            name: '文章列表',
            path: '/content/article/list',
            type: 'menu',
            permission: 'content:article:list'
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: '数据统计',
    icon: 'TrendCharts',
    path: '/statistics',
    type: 'menu',
    permission: 'statistics',
    children: [
      {
        id: 71,
        name: '运营数据',
        path: '/statistics/operation',
        type: 'menu',
        permission: 'statistics:operation',
        children: [
          {
            id: 711,
            name: '用户分析',
            path: '/statistics/operation/users',
            type: 'menu',
            permission: 'statistics:operation:users'
          },
          {
            id: 712,
            name: '订单分析',
            path: '/statistics/operation/orders',
            type: 'menu',
            permission: 'statistics:operation:orders'
          },
          {
            id: 713,
            name: '收入统计',
            path: '/statistics/operation/revenue',
            type: 'menu',
            permission: 'statistics:operation:revenue'
          }
        ]
      },
      {
        id: 72,
        name: '设备数据',
        path: '/statistics/equipment',
        type: 'menu',
        permission: 'statistics:equipment',
        children: [
          {
            id: 721,
            name: '使用率分析',
            path: '/statistics/equipment/usage',
            type: 'menu',
            permission: 'statistics:equipment:usage'
          },
          {
            id: 722,
            name: '故障率统计',
            path: '/statistics/equipment/failure',
            type: 'menu',
            permission: 'statistics:equipment:failure'
          }
        ]
      },
      {
        id: 73,
        name: '飞手数据',
        path: '/statistics/pilot',
        type: 'menu',
        permission: 'statistics:pilot',
        children: [
          {
            id: 731,
            name: '接单统计',
            path: '/statistics/pilot/orders',
            type: 'menu',
            permission: 'statistics:pilot:orders'
          },
          {
            id: 732,
            name: '评分分析',
            path: '/statistics/pilot/ratings',
            type: 'menu',
            permission: 'statistics:pilot:ratings'
          }
        ]
      }
    ]
  },
  {
    id: 8,
    name: '合作商管理',
    icon: 'Money',
    path: '/partner',
    type: 'menu',
    permission: 'partner',
    children: [
      {
        id: 81,
        name: '合作商信息管理',
        path: '/partner/info',
        type: 'menu',
        permission: 'partner:info'
      },
      {
        id: 82,
        name: '合作商业绩监控',
        path: '/partner/performance',
        type: 'menu',
        permission: 'partner:performance'
      },
      {
        id: 83,
        name: '库存管理监控',
        path: '/partner/inventory',
        type: 'menu',
        permission: 'partner:inventory'
      },
      {
        id: 84,
        name: '推广活动监控',
        path: '/partner/promotion',
        type: 'menu',
        permission: 'partner:promotion'
      },
      {
        id: 85,
        name: '合作商信用管理',
        path: '/partner/credit',
        type: 'menu',
        permission: 'partner:credit'
      }
    ]
  },
  {
    id: 9,
    name: '系统管理',
    icon: 'Setting',
    path: '/system',
    type: 'menu',
    permission: 'system',
    children: [
      {
        id: 91,
        name: '菜单管理',
        path: '/system/menu',
        type: 'menu',
        permission: 'system:menu'
      },
      {
        id: 92,
        name: '字典管理',
        path: '/system/dict',
        type: 'menu',
        permission: 'system:dict'
      }
    ]
  }
])

const roleFormVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const currentRole = ref({})
const checkedPermissions = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  loadRoles()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value.keyword = ''
  handleSearch()
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  loadRoles()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  loadRoles()
}

// 加载角色数据
const loadRoles = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 过滤数据
    let filteredList = [...roles.value]
    
    if (searchForm.value.keyword) {
      const keyword = searchForm.value.keyword.toLowerCase()
      filteredList = filteredList.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      )
    }
    
    // 计算分页
    total.value = filteredList.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    
    roles.value = filteredList.slice(start, end)
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRoles()
})

const handleAddRole = () => {
  isEdit.value = false
  currentRole.value = {}
  roleFormVisible.value = true
}

const handleEditRole = (row) => {
  isEdit.value = true
  currentRole.value = { ...row }
  roleFormVisible.value = true
}

const handleRoleSubmit = async (formData) => {
  // 实现保存逻辑
  ElMessage.success(isEdit.value ? '角色更新成功' : '角色创建成功')
  // 重新加载角色列表
  loadRoles()
}

const handleConfigPermissions = async (row) => {
  currentRole.value = row
  try {
    checkedPermissions.value = await roleService.getRolePermissions(row.id)
    permissionDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取角色权限失败')
  }
}

const handleSavePermissions = async () => {
  try {
    await roleService.saveRolePermissions(
      currentRole.value.id,
      checkedPermissions.value
    )
    ElMessage.success('权限配置保存成功')
    permissionDialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存权限配置失败')
  }
}

const handleDeleteRole = (row) => {
  if (row.id === 1) {
    ElMessage.warning('超级管理员角色不能删除')
    return
  }

  ElMessageBox.confirm(
    `确定要删除角色 "${row.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
    // 重新加载角色列表
    loadRoles()
  })
}

</script>

<style scoped>
.role-config {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

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
}

.search-input {
  width: 220px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.permission-title {
  margin-bottom: 20px;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
}

:deep(.el-button--link) {
  padding: 4px 8px;
  font-size: 13px;
}
</style>