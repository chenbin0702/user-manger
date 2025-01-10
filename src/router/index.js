import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: '/users',
        name: 'UserList',
        component: () => import('../views/users/UserList.vue'),
        meta: { title: '用户列表' }
      },
      {
        path: '/roles',
        name: 'RoleConfig',
        component: () => import('../views/users/RoleConfig.vue'),
        meta: { title: '角色配置' }
      },
      {
        path: '/permissions',
        name: 'PermissionSettings',
        component: () => import('../views/users/PermissionSettings.vue'),
        meta: { title: '权限设置' }
      },
      {
        path: '/identity-verification',
        name: 'IdentityVerification',
        component: () => import('../views/auth/IdentityVerification.vue'),
        meta: { title: '实名认证审核' }
      },
      {
        path: '/pilot-qualification',
        name: 'PilotQualification',
        component: () => import('../views/auth/PilotQualification.vue'),
        meta: { title: '飞手资质审核' }
      },
      {
        path: '/certificate-management',
        name: 'CertificateManagement',
        component: () => import('../views/auth/CertificateManagement.vue'),
        meta: { title: '证书管理' }
      },
      {
        path: '/equipment/categories',
        name: 'CategoryManagement',
        component: () => import('../views/equipment/CategoryManagement.vue'),
        meta: { title: '设备分类' }
      },
      {
        path: '/equipment/list',
        name: 'EquipmentList',
        component: () => import('../views/equipment/EquipmentList.vue'),
        meta: { title: '设备列表' }
      },
      {
        path: '/equipment/inventory',
        name: 'InventoryManagement',
        component: () => import('../views/equipment/InventoryManagement.vue'),
        meta: { title: '库存管理' }
      },
      {
        path: '/rental/orders',
        name: 'RentalOrders',
        component: () => import('../views/rental/RentalOrders.vue'),
        meta: { title: '租赁订单' }
      },
      {
        path: '/rental/rules',
        name: 'RentalRules',
        component: () => import('../views/rental/RentalRules.vue'),
        meta: { title: '租赁规则' }
      },
      {
        path: '/rental/deposits',
        name: 'DepositManagement',
        component: () => import('../views/rental/DepositManagement.vue'),
        meta: { title: '押金管理' }
      },
      {
        path: '/orders',
        name: 'OrderManagement',
        component: () => import('../views/order/OrderManagement.vue'),
        meta: { title: '订单列表' }
      },
      {
        path: '/orders/statistics',
        name: 'OrderStatistics',
        component: () => import('../views/order/OrderStatistics.vue'),
        meta: { title: '订单统计' }
      },
      {
        path: '/orders/categories',
        name: 'OrderCategories',
        component: () => import('../views/order/OrderCategories.vue'),
        meta: { title: '订单分类' }
      },
      {
        path: '/orders/training/course',
        name: 'TrainingCourseOrders',
        component: () => import('../views/order/training/CourseOrders.vue'),
        meta: { title: '课程订单' }
      },
      {
        path: '/orders/training/certificate',
        name: 'TrainingCertificateOrders',
        component: () => import('../views/order/training/CertificateOrders.vue'),
        meta: { title: '考证订单' }
      },
      {
        path: '/orders/insurance/policy',
        name: 'InsurancePolicyOrders',
        component: () => import('../views/order/insurance/PolicyOrders.vue'),
        meta: { title: '保单管理' }
      },
      {
        path: '/orders/insurance/claims',
        name: 'InsuranceClaimsOrders',
        component: () => import('../views/order/insurance/ClaimsOrders.vue'),
        meta: { title: '理赔管理' }
      },
      {
        path: '/content/course/categories',
        name: 'CourseCategories',
        component: () => import('../views/content/course/Categories.vue'),
        meta: { title: '课程分类' }
      },
      {
        path: '/content/course/list',
        name: 'CourseList',
        component: () => import('../views/content/course/List.vue'),
        meta: { title: '课程列表' }
      },
      {
        path: '/content/course/teachers',
        name: 'TeacherManagement',
        component: () => import('../views/content/course/Teachers.vue'),
        meta: { title: '讲师管理' }
      },
      {
        path: '/content/ad/positions',
        name: 'AdPositions',
        component: () => import('../views/content/ad/Positions.vue'),
        meta: { title: '广告位管理' }
      },
      {
        path: '/content/ad/list',
        name: 'AdList',
        component: () => import('../views/content/ad/List.vue'),
        meta: { title: '广告内容' }
      },
      {
        path: '/content/article/categories',
        name: 'ArticleCategories',
        component: () => import('../views/content/article/Categories.vue'),
        meta: { title: '文章分类' }
      },
      {
        path: '/content/article/list',
        name: 'ArticleList',
        component: () => import('../views/content/article/ArticleList.vue'),
        meta: { title: '文章列表' }
      },
      {
        path: '/statistics/operation/users',
        name: 'UserAnalysis',
        component: () => import('../views/statistics/operation/UserAnalysis.vue'),
        meta: { title: '用户分析' }
      },
      {
        path: '/statistics/operation/orders',
        name: 'OrderAnalysis',
        component: () => import('../views/statistics/operation/OrderAnalysis.vue'),
        meta: { title: '订单分析' }
      },
      {
        path: '/statistics/operation/revenue',
        name: 'RevenueStatistics',
        component: () => import('../views/statistics/operation/RevenueStatistics.vue'),
        meta: { title: '收入统计' }
      },
      {
        path: '/statistics/equipment/usage',
        name: 'EquipmentUsageAnalysis',
        component: () => import('../views/statistics/equipment/UsageAnalysis.vue'),
        meta: { title: '使用率分析' }
      },
      {
        path: '/statistics/equipment/failure',
        name: 'EquipmentFailureAnalysis',
        component: () => import('../views/statistics/equipment/FailureAnalysis.vue'),
        meta: { title: '故障率统计' }
      },
      {
        path: '/statistics/pilot/orders',
        name: 'PilotOrderStatistics',
        component: () => import('../views/statistics/pilot/OrderStatistics.vue'),
        meta: { title: '接单统计' }
      },
      {
        path: '/statistics/pilot/ratings',
        name: 'PilotRatingAnalysis',
        component: () => import('../views/statistics/pilot/RatingAnalysis.vue'),
        meta: { title: '评分分析' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/user-manger/'),
  routes
})

export default router