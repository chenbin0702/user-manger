<template>
  <div class="menu-management">
    <div class="header">
      <h2>菜单管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增菜单
      </el-button>
    </div>

    <el-table
      :data="menuList"
      row-key="id"
      :tree-props="{ children: 'children' }"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="菜单名称" width="180" />
      <el-table-column prop="icon" label="图标" width="100">
        <template #default="{ row }">
          <el-icon v-if="row.icon">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由路径" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'menu' ? '' : 'info'">
            {{ row.type === 'menu' ? '菜单' : '按钮' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="permission" label="权限标识" />
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
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleAdd(row)">添加子菜单</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="menuForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTreeData"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级菜单"
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="menuForm.type">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="图标" v-if="menuForm.type === 'menu'">
          <icon-select v-model="menuForm.icon" />
        </el-form-item>
        <el-form-item label="路由路径" v-if="menuForm.type === 'menu'" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" v-if="menuForm.type === 'menu'" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径,如: @/views/system/menu.vue" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="menuForm.status"
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
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import IconSelect from '@/components/IconSelect/index.vue'

// 注册所有图标组件

// 菜单列表数据
const menuList = ref([
  {
    id: 1,
    name: '仪表盘',
    icon: 'Odometer',
    path: '/dashboard',
    type: 'menu',
    permission: 'dashboard',
    sort: 1,
    status: 1
  },
  {
    id: 2,
    name: '用户管理',
    icon: 'User',
    path: '/user',
    type: 'menu',
    permission: 'user',
    sort: 2,
    status: 1,
    children: [
      {
        id: 21,
        name: '账户管理',
        path: '/user/account',
        type: 'menu',
        permission: 'user:account',
        sort: 1,
        status: 1,
        children: [
          {
            id: 211,
            name: '用户列表',
            path: '/user/account/list',
            type: 'menu',
            permission: 'user:account:list',
            sort: 1,
            status: 1
          },
          {
            id: 212,
            name: '角色配置',
            path: '/user/account/roles',
            type: 'menu',
            permission: 'user:account:roles',
            sort: 2,
            status: 1
          }
        ]
      },
      {
        id: 22,
        name: '认证管理',
        path: '/user/auth',
        type: 'menu',
        permission: 'user:auth',
        sort: 2,
        status: 1,
        children: [
          {
            id: 221,
            name: '实名认证审核',
            path: '/user/auth/identity',
            type: 'menu',
            permission: 'user:auth:identity',
            sort: 1,
            status: 1
          },
          {
            id: 222,
            name: '飞手资质审核',
            path: '/user/auth/pilot',
            type: 'menu',
            permission: 'user:auth:pilot',
            sort: 2,
            status: 1
          },
          {
            id: 223,
            name: '证书管理',
            path: '/user/auth/certificate',
            type: 'menu',
            permission: 'user:auth:certificate',
            sort: 3,
            status: 1
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
    sort: 3,
    status: 1,
    children: [
      {
        id: 31,
        name: '设备分类',
        path: '/equipment/categories',
        type: 'menu',
        permission: 'equipment:categories',
        sort: 1,
        status: 1
      },
      {
        id: 32,
        name: '设备列表',
        path: '/equipment/list',
        type: 'menu',
        permission: 'equipment:list',
        sort: 2,
        status: 1
      },
      {
        id: 33,
        name: '库存管理',
        path: '/equipment/inventory',
        type: 'menu',
        permission: 'equipment:inventory',
        sort: 3,
        status: 1
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
    sort: 4,
    status: 1,
    children: [
      {
        id: 41,
        name: '租赁订单',
        path: '/rental/orders',
        type: 'menu',
        permission: 'rental:orders',
        sort: 1,
        status: 1
      },
      {
        id: 42,
        name: '租赁规则',
        path: '/rental/rules',
        type: 'menu',
        permission: 'rental:rules',
        sort: 2,
        status: 1
      },
      {
        id: 43,
        name: '押金管理',
        path: '/rental/deposits',
        type: 'menu',
        permission: 'rental:deposits',
        sort: 3,
        status: 1
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
    sort: 5,
    status: 1,
    children: [
      {
        id: 51,
        name: '订单列表',
        path: '/order/list',
        type: 'menu',
        permission: 'order:list',
        sort: 1,
        status: 1
      },
      {
        id: 52,
        name: '订单统计',
        path: '/order/statistics',
        type: 'menu',
        permission: 'order:statistics',
        sort: 2,
        status: 1
      },
      {
        id: 53,
        name: '订单分类',
        path: '/order/categories',
        type: 'menu',
        permission: 'order:categories',
        sort: 3,
        status: 1
      },
      {
        id: 54,
        name: '培训订单',
        path: '/order/training',
        type: 'menu',
        permission: 'order:training',
        sort: 4,
        status: 1,
        children: [
          {
            id: 541,
            name: '课程订单',
            path: '/order/training/course',
            type: 'menu',
            permission: 'order:training:course',
            sort: 1,
            status: 1
          },
          {
            id: 542,
            name: '考证订单',
            path: '/order/training/certificate',
            type: 'menu',
            permission: 'order:training:certificate',
            sort: 2,
            status: 1
          }
        ]
      },
      {
        id: 55,
        name: '保险订单',
        path: '/order/insurance',
        type: 'menu',
        permission: 'order:insurance',
        sort: 5,
        status: 1,
        children: [
          {
            id: 551,
            name: '保单管理',
            path: '/order/insurance/policy',
            type: 'menu',
            permission: 'order:insurance:policy',
            sort: 1,
            status: 1
          },
          {
            id: 552,
            name: '理赔管理',
            path: '/order/insurance/claims',
            type: 'menu',
            permission: 'order:insurance:claims',
            sort: 2,
            status: 1
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
    sort: 6,
    status: 1,
    children: [
      {
        id: 61,
        name: '课程管理',
        path: '/content/course',
        type: 'menu',
        permission: 'content:course',
        sort: 1,
        status: 1,
        children: [
          {
            id: 611,
            name: '课程分类',
            path: '/content/course/categories',
            type: 'menu',
            permission: 'content:course:categories',
            sort: 1,
            status: 1
          },
          {
            id: 612,
            name: '课程列表',
            path: '/content/course/list',
            type: 'menu',
            permission: 'content:course:list',
            sort: 2,
            status: 1
          },
          {
            id: 613,
            name: '讲师管理',
            path: '/content/course/teachers',
            type: 'menu',
            permission: 'content:course:teachers',
            sort: 3,
            status: 1
          }
        ]
      },
      {
        id: 62,
        name: '广告管理',
        path: '/content/ad',
        type: 'menu',
        permission: 'content:ad',
        sort: 2,
        status: 1,
        children: [
          {
            id: 621,
            name: '广告位管理',
            path: '/content/ad/positions',
            type: 'menu',
            permission: 'content:ad:positions',
            sort: 1,
            status: 1
          },
          {
            id: 622,
            name: '广告内容',
            path: '/content/ad/list',
            type: 'menu',
            permission: 'content:ad:list',
            sort: 2,
            status: 1
          }
        ]
      },
      {
        id: 63,
        name: '资讯管理',
        path: '/content/article',
        type: 'menu',
        permission: 'content:article',
        sort: 3,
        status: 1,
        children: [
          {
            id: 631,
            name: '文章分类',
            path: '/content/article/categories',
            type: 'menu',
            permission: 'content:article:categories',
            sort: 1,
            status: 1
          },
          {
            id: 632,
            name: '文章列表',
            path: '/content/article/list',
            type: 'menu',
            permission: 'content:article:list',
            sort: 2,
            status: 1
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
    sort: 7,
    status: 1,
    children: [
      {
        id: 71,
        name: '运营数据',
        path: '/statistics/operation',
        type: 'menu',
        permission: 'statistics:operation',
        sort: 1,
        status: 1,
        children: [
          {
            id: 711,
            name: '用户分析',
            path: '/statistics/operation/users',
            type: 'menu',
            permission: 'statistics:operation:users',
            sort: 1,
            status: 1
          },
          {
            id: 712,
            name: '订单分析',
            path: '/statistics/operation/orders',
            type: 'menu',
            permission: 'statistics:operation:orders',
            sort: 2,
            status: 1
          },
          {
            id: 713,
            name: '收入统计',
            path: '/statistics/operation/revenue',
            type: 'menu',
            permission: 'statistics:operation:revenue',
            sort: 3,
            status: 1
          }
        ]
      },
      {
        id: 72,
        name: '设备数据',
        path: '/statistics/equipment',
        type: 'menu',
        permission: 'statistics:equipment',
        sort: 2,
        status: 1,
        children: [
          {
            id: 721,
            name: '使用率分析',
            path: '/statistics/equipment/usage',
            type: 'menu',
            permission: 'statistics:equipment:usage',
            sort: 1,
            status: 1
          },
          {
            id: 722,
            name: '故障率统计',
            path: '/statistics/equipment/failure',
            type: 'menu',
            permission: 'statistics:equipment:failure',
            sort: 2,
            status: 1
          }
        ]
      },
      {
        id: 73,
        name: '飞手数据',
        path: '/statistics/pilot',
        type: 'menu',
        permission: 'statistics:pilot',
        sort: 3,
        status: 1,
        children: [
          {
            id: 731,
            name: '接单统计',
            path: '/statistics/pilot/orders',
            type: 'menu',
            permission: 'statistics:pilot:orders',
            sort: 1,
            status: 1
          },
          {
            id: 732,
            name: '评分分析',
            path: '/statistics/pilot/ratings',
            type: 'menu',
            permission: 'statistics:pilot:ratings',
            sort: 2,
            status: 1
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
    sort: 8,
    status: 1,
    children: [
      {
        id: 81,
        name: '合作商信息管理',
        path: '/partner/info',
        type: 'menu',
        permission: 'partner:info',
        sort: 1,
        status: 1
      },
      {
        id: 82,
        name: '合作商业绩监控',
        path: '/partner/performance',
        type: 'menu',
        permission: 'partner:performance',
        sort: 2,
        status: 1
      },
      {
        id: 83,
        name: '库存管理监控',
        path: '/partner/inventory',
        type: 'menu',
        permission: 'partner:inventory',
        sort: 3,
        status: 1
      },
      {
        id: 84,
        name: '推广活动监控',
        path: '/partner/promotion',
        type: 'menu',
        permission: 'partner:promotion',
        sort: 4,
        status: 1
      },
      {
        id: 85,
        name: '合作商信用管理',
        path: '/partner/credit',
        type: 'menu',
        permission: 'partner:credit',
        sort: 5,
        status: 1
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
    sort: 9,
    status: 1,
    children: [
      {
        id: 91,
        name: '菜单管理',
        path: '/system/menu',
        type: 'menu',
        permission: 'system:menu',
        sort: 1,
        status: 1
      },
      {
        id: 92,
        name: '字典管理',
        path: '/system/dict',
        type: 'menu',
        permission: 'system:dict',
        sort: 2,
        status: 1
      }
    ]
  }
])

// 菜单表单数据
const dialogVisible = ref(false)
const isEdit = ref(false)
const menuForm = ref({
  parentId: null,
  type: 'menu',
  name: '',
  icon: '',
  path: '',
  component: '',
  permission: '',
  sort: 0,
  status: 1
})

// 生成菜单树形数据
const menuTreeData = computed(() => {
  const copyData = JSON.parse(JSON.stringify(menuList.value))
  return [{
    id: 0,
    name: '顶级菜单',
    children: copyData
  }]
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
  permission: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
}

// 处理添加菜单
const handleAdd = (row = null) => {
  isEdit.value = false
  menuForm.value = {
    parentId: row?.id || null,
    type: 'menu',
    name: '',
    icon: '',
    path: '',
    component: '',
    permission: '',
    sort: 0,
    status: 1
  }
  dialogVisible.value = true
}

// 处理编辑菜单
const handleEdit = (row) => {
  isEdit.value = true
  menuForm.value = { ...row }
  dialogVisible.value = true
}

// 处理删除菜单
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认要删除菜单"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

// 处理状态变更
const handleStatusChange = (row) => {
  // 实现状态变更逻辑
  ElMessage.success(`${row.name}状态更新成功`)
}

// 处理表单提交
const handleSubmit = () => {
  // 实现表单提交逻辑
  ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
  dialogVisible.value = false
}

// 获取菜单树形选项
const menuOptions = ref([])

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.menu-management {
  padding: 20px;
  background: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

:deep(.el-table__row) {
  .el-icon {
    vertical-align: middle;
  }
}
</style> 