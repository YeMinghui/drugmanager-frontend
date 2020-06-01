import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard'}
    }]
  },
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [

  {
    path: '/common',
    component: Layout,
    redirect: '/common/info',
    name: 'Common',
    meta: {title: '个人', icon: 'user'},
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/user/info'),
        meta: {title: '个人信息', icon: 'user'}
      },
      {
        path: 'password',
        name: 'Password',
        component: () => import('@/views/user/password'),
        meta: {title: '密码修改', icon: 'password'}
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'UserManage',
    meta: {title: '用户管理', icon: 'usermanage', roles: ['admin']},
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list'),
        meta: {title: '所有用户', icon: 'users'}
      },
      {
        path: 'add',
        name: 'UserAdd',
        component: () => import('@/views/user/add'),
        meta: {title: '添加用户', icon: 'adduser'}
      }
    ]
  },

  {
    path: '/depart',
    component: Layout,
    name: 'DepartManage',
    meta: {icon: 'depart', roles: ['admin']},
    children: [
      {
        path: '/depart',
        name: 'DepartList',
        component: () => import('@/views/depart/list'),
        meta: {title: '科室管理'}
      }
    ]
  },

  {
    path: '/role',
    component: Layout,
    redirect: '/role/list',
    name: 'RoleManage',
    meta: {roles: ['admin']},
    children: [
      {
        path: 'list',
        name: 'RoleList',
        component: () => import('@/views/role/list'),
        meta: {title: '角色管理', icon: 'roles'}
      }
    ]
  },

  {
    path: '/manufacturer',
    name: 'Manufacturer',
    component: Layout,
    redirect: '/manufacturer/list',
    meta: {icon: 'shengchan', roles: ['admin']},
    children: [
      {
        path: 'list',
        name: 'ManufacturerList',
        component: () => import('@/views/manufacturer/list'),
        meta: {title: '厂家管理'}
      }
    ]
  },

  {
    path: '/supplier',
    name: 'Supplier',
    component: Layout,
    redirect: '/supplier/list',
    meta: {icon: 'gongyin', roles: ['admin']},
    children: [
      {
        path: 'list',
        name: 'SupplierList',
        component: () => import('@/views/supplier/list'),
        meta: {title: '供应商管理'}
      }
    ]
  },


  {
    path: '/drug',
    component: Layout,
    name: 'DrugManage',
    redirect: '/drug/list',
    meta: {title: '药品管理', icon: 'drug'},
    children: [
      {
        path: 'list',
        name: 'DrugList',
        component: () => import('@/views/drug/list'),
        meta: {title: '药品信息管理', roles: ['drugmanage']}
      },
      {
        path: 'info',
        name: 'DrugView',
        component: () => import('@/views/drug/norole'),
        meta: {title: '药品查看', roles: ['drug']},
      }
    ]
  },

  {
    path: '/inventory',
    component: Layout,
    name: 'Inventory',
    meta: {title: '库存管理', icon: 'kucun', roles: ['inventory']},
    children: [
      {
        path: 'list',
        name: 'InventoryList',
        component: () => import('@/views/inventory/list'),
        meta: {title: '查看库存'}
      },
      {
        path: 'hist',
        name: 'InventoryHist',
        component: () => import('@/views/inventory/oprhist'),
        meta: {title: '库存变动记录'}
      }
    ]
  },

  {
    path: '/doctor',
    component: Layout,
    name: 'Doctor',
    redirect: '/geiyao/geiyao',
    meta: {title: '医生操作', icon: 'doctor', roles: ['drug']},
    children: [
      {
        path: 'geiyao',
        name: 'UseDrug',
        component: () => import('@/views/doctor/geiyao'),
        meta: {title: '给药'}
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
];

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
