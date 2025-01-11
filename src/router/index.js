import { createRouter,createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import Layout from '@/layout/index.vue'

// 配置 NProgress
NProgress.configure({ 
  showSpinner: false,  // 是否显示加载微调器
  easing: 'ease',      // 动画方式
  speed: 500,          // 速度
  minimum: 0.3         // 最小百分比
})

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', hidden: true }
      },
      {
        path: '/user',
        name: 'User',
        meta: { title: '用户管理', icon: 'User' },
        redirect: '/user/account/list',
        children: [
          {
            path: 'account',
            name: 'Account',
            meta: { title: '账户管理' },
            redirect: '/user/account/list',
            children: [
              {
                path: 'list',
                name: 'UserList',
                component: () => import('@/views/users/UserList.vue'),
                meta: { title: '用户列表' }
              },
              {
                path: 'roles',
                name: 'RoleConfig',
                component: () => import('@/views/users/RoleConfig.vue'),
                meta: { title: '角色配置' }
              },
              {
                path: 'permissions',
                name: 'PermissionSettings',
                component: () => import('@/views/users/PermissionSettings.vue'),
                meta: { title: '权限设置' }
              }
            ]
          },
          {
            path: 'auth',
            name: 'Auth',
            meta: { title: '认证管理' },
            redirect: '/user/auth/identity',
            children: [
              {
                path: 'identity',
                name: 'IdentityVerification',
                component: () => import('@/views/auth/IdentityVerification.vue'),
                meta: { title: '实名认证审核' }
              },
              {
                path: 'pilot',
                name: 'PilotQualification',
                component: () => import('@/views/auth/PilotQualification.vue'),
                meta: { title: '飞手资质审核' }
              },
              {
                path: 'certificate',
                name: 'CertificateManagement',
                component: () => import('@/views/auth/CertificateManagement.vue'),
                meta: { title: '证书管理' }
              }
            ]
          }
        ]
      },
      {
        path: '/equipment',
        name: 'Equipment',
        meta: { title: '设备管理', icon: 'Box' },
        redirect: '/equipment/categories',
        children: [
          {
            path: 'categories',
            name: 'CategoryManagement',
            component: () => import('@/views/equipment/CategoryManagement.vue'),
            meta: { title: '设备分类' }
          },
          {
            path: 'list',
            name: 'EquipmentList',
            component: () => import('@/views/equipment/EquipmentList.vue'),
            meta: { title: '设备列表' }
          },
          {
            path: 'inventory',
            name: 'InventoryManagement',
            component: () => import('@/views/equipment/InventoryManagement.vue'),
            meta: { title: '库存管理' }
          }
        ]
      },
      {
        path: '/rental',
        name: 'Rental',
        meta: { title: '租赁管理', icon: 'Tickets' },
        redirect: '/rental/orders',
        children: [
          {
            path: 'orders',
            name: 'RentalOrders',
            component: () => import('@/views/rental/RentalOrders.vue'),
            meta: { title: '租赁订单' }
          },
          {
            path: 'rules',
            name: 'RentalRules',
            component: () => import('@/views/rental/RentalRules.vue'),
            meta: { title: '租赁规则' }
          },
          {
            path: 'deposits',
            name: 'DepositManagement',
            component: () => import('@/views/rental/DepositManagement.vue'),
            meta: { title: '押金管理' }
          }
        ]
      },
      {
        path: '/order',
        name: 'Order',
        meta: { title: '订单管理', icon: 'Document' },
        redirect: '/order/list',
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/views/order/OrderManagement.vue'),
            meta: { title: '订单列表' }
          },
          {
            path: 'statistics',
            name: 'OrderStatistics',
            component: () => import('@/views/order/OrderStatistics.vue'),
            meta: { title: '订单统计' }
          },
          {
            path: 'categories',
            name: 'OrderCategories',
            component: () => import('@/views/order/OrderCategories.vue'),
            meta: { title: '订单分类' }
          },
          {
            path: 'training',
            name: 'Training',
            meta: { title: '培训订单' },
            redirect: '/order/training/course',
            children: [
              {
                path: 'course',
                name: 'TrainingCourseOrders',
                component: () => import('@/views/order/training/CourseOrders.vue'),
                meta: { title: '课程订单' }
              },
              {
                path: 'certificate',
                name: 'TrainingCertificateOrders',
                component: () => import('@/views/order/training/CertificateOrders.vue'),
                meta: { title: '考证订单' }
              }
            ]
          },
          {
            path: 'insurance',
            name: 'Insurance',
            meta: { title: '保险订单' },
            redirect: '/order/insurance/policy',
            children: [
              {
                path: 'policy',
                name: 'InsurancePolicyOrders',
                component: () => import('@/views/order/insurance/PolicyOrders.vue'),
                meta: { title: '保单管理' }
              },
              {
                path: 'claims',
                name: 'InsuranceClaimsOrders',
                component: () => import('@/views/order/insurance/ClaimsOrders.vue'),
                meta: { title: '理赔管理' }
              }
            ]
          }
        ]
      },
      {
        path: '/content',
        name: 'Content',
        meta: { title: '内容管理', icon: 'Reading' },
        redirect: '/content/course/categories',
        children: [
          {
            path: 'course',
            name: 'Course',
            meta: { title: '课程管理' },
            redirect: '/content/course/categories',
            children: [
              {
                path: 'categories',
                name: 'CourseCategories',
                component: () => import('@/views/content/course/Categories.vue'),
                meta: { title: '课程分类' }
              },
              {
                path: 'list',
                name: 'CourseList',
                component: () => import('@/views/content/course/List.vue'),
                meta: { title: '课程列表' }
              },
              {
                path: 'teachers',
                name: 'TeacherManagement',
                component: () => import('@/views/content/course/Teachers.vue'),
                meta: { title: '讲师管理' }
              }
            ]
          },
          {
            path: 'ad',
            name: 'Ad',
            meta: { title: '广告管理' },
            redirect: '/content/ad/positions',
            children: [
              {
                path: 'positions',
                name: 'AdPositions',
                component: () => import('@/views/content/ad/Positions.vue'),
                meta: { title: '广告位管理' }
              },
              {
                path: 'list',
                name: 'AdList',
                component: () => import('@/views/content/ad/List.vue'),
                meta: { title: '广告内容' }
              }
            ]
          },
          {
            path: 'article',
            name: 'Article',
            meta: { title: '资讯管理' },
            redirect: '/content/article/categories',
            children: [
              {
                path: 'categories',
                name: 'ArticleCategories',
                component: () => import('@/views/content/article/Categories.vue'),
                meta: { title: '文章分类' }
              },
              {
                path: 'list',
                name: 'ArticleList',
                component: () => import('@/views/content/article/ArticleList.vue'),
                meta: { title: '文章列表' }
              }
            ]
          }
        ]
      },
      {
        path: '/statistics',
        name: 'Statistics',
        meta: { title: '数据统计', icon: 'TrendCharts' },
        redirect: '/statistics/operation/users',
        children: [
          {
            path: 'operation',
            name: 'Operation',
            meta: { title: '运营数据' },
            redirect: '/statistics/operation/users',
            children: [
              {
                path: 'users',
                name: 'UserAnalysis',
                component: () => import('@/views/statistics/operation/UserAnalysis.vue'),
                meta: { title: '用户分析' }
              },
              {
                path: 'orders',
                name: 'OrderAnalysis',
                component: () => import('@/views/statistics/operation/OrderAnalysis.vue'),
                meta: { title: '订单分析' }
              },
              {
                path: 'revenue',
                name: 'RevenueStatistics',
                component: () => import('@/views/statistics/operation/RevenueStatistics.vue'),
                meta: { title: '收入统计' }
              }
            ]
          },
          {
            path: 'equipment',
            name: 'EquipmentStats',
            meta: { title: '设备数据' },
            redirect: '/statistics/equipment/usage',
            children: [
              {
                path: 'usage',
                name: 'EquipmentUsageAnalysis',
                component: () => import('@/views/statistics/equipment/UsageAnalysis.vue'),
                meta: { title: '使用率分析' }
              },
              {
                path: 'failure',
                name: 'EquipmentFailureAnalysis',
                component: () => import('@/views/statistics/equipment/FailureAnalysis.vue'),
                meta: { title: '故障率统计' }
              }
            ]
          },
          {
            path: 'pilot',
            name: 'PilotStats',
            meta: { title: '飞手数据' },
            redirect: '/statistics/pilot/orders',
            children: [
              {
                path: 'orders',
                name: 'PilotOrderStatistics',
                component: () => import('@/views/statistics/pilot/OrderStatistics.vue'),
                meta: { title: '接单统计' }
              },
              {
                path: 'ratings',
                name: 'PilotRatingAnalysis',
                component: () => import('@/views/statistics/pilot/RatingAnalysis.vue'),
                meta: { title: '评分分析' }
              }
            ]
          }
        ]
      },
      {
        path: '/partner',
        name: 'Partner',
        redirect: '/partner/info',
        meta: {
          title: '合作商管理',
          icon: 'Money'  // 使用 element-plus 的图标
        },
        children: [
          {
            path: 'info',
            name: 'PartnerInfo',
            component: () => import('@/views/partner/PartnerInfo.vue'),
            meta: { title: '合作商信息管理' }
          },
          {
            path: 'performance',
            name: 'PartnerPerformance',
            component: () => import('@/views/partner/PartnerPerformance.vue'),
            meta: { title: '合作商业绩监控' }
          },
          {
            path: 'inventory',
            name: 'PartnerInventory',
            component: () => import('@/views/partner/PartnerInventory.vue'),
            meta: { title: '库存管理监控' }
          },
          {
            path: 'promotion',
            name: 'PartnerPromotion',
            component: () => import('@/views/partner/PartnerPromotion.vue'),
            meta: { title: '推广活动监控' }
          },
          {
            path: 'credit',
            name: 'PartnerCredit',
            component: () => import('@/views/partner/PartnerCredit.vue'),
            meta: { title: '合作商信用管理' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory('/user-manger/'),
  routes: constantRoutes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()
  next()
})

// 路由后置守卫
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

export default router