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
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/my',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  //
  
  //
]

// 权限路由
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    meta: { 
      roles: ['TEACHER'],
      icon: 'user',
      title: '用户管理' 
    },
    children: [{
        path: 'add',
        name: 'user-add',
        component: () => import('@/views/user/user-add'),
        meta: {
          title: '添加用户',
        }
      },
      {
        path: 'list',
        name: 'user-list',
        component: () => import('@/views/user/user-list'),
        meta: {
          title: '用户列表',
        }
      }
    ] 
  },
  {
    path: '/course',
    component: Layout,
    meta: { 
      roles: ['ADMIN'],
      icon: 'example',
      title: '课程管理' 
    },
    children: [{
        path: 'add',
        name: 'course-add',
        component: () => import('@/views/course/course-add'),
        meta: {
          title: '添加课程',
        }
      },
      {
        path: 'list',
        name: 'course-list',
        component: () => import('@/views/course/course-list'),
        meta: {
          title: '课程列表',
        }
      }
    ] 
  },
  {
    path: '/score',
    component: Layout,
    name: 'Score',
    meta: {
      roles: ['STUDENT', 'TEACHER'],
      
    },
    children: [
      {
        path: 'top10',
        component: () => import('@/views/score'),
        name: 'Top10Score',
        meta: {
          title: '排行榜',
          icon: 'nested'
        }
      }
    ]
  },
  {
    path: '/exam',
    component: Layout,
    name: 'ExamPage',
    meta: {
      roles: ['ADMIN', 'TEACHER'],
      title: '作业管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'paper/list',
        component: () => import('@/views/exam/paper/list'),
        name: 'ExamPaperPageList',
        meta: { title: '作业列表', }
      },

      
      {
        path: 'paper/edit',
        component: () => import('@/views/exam/paper/edit'),
        name: 'ExamPaperEdit',
        meta: { title: '布置作业' }
      },
      {
        path: 'question/list',
        component: () => import('@/views/exam/question/list'),
        name: 'ExamQuestionPageList',
        meta: { title: '题目列表',  }
      },
      {
        path: 'question/edit/singleChoice',
        component: () => import('@/views/exam/question/edit/single-choice'),
        name: 'singleChoicePage',
        meta: { title: '单选题编辑' },
        
      },
      {
        path: 'question/edit/code',
        component: () => import('@/views/exam/question/edit/code'),
        name: 'codePage',
        meta: { title: '代码题编辑' },
        
      },
      // {
      //   path: 'question/edit/gapFilling',
      //   component: () => import('@/views/exam/question/edit/gap-filling'),
      //   name: 'gapFillingPage',
      //   meta: { title: '填空题编辑', noCache: true, activeMenu: '/exam/question/list' },
      // },
    ]
  },
  {
    path: '/work',
    component: Layout,
    name: '学生作业',
    meta: {
      roles: ['STUDENT'],
      title: '作业管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/student/work/list'),
        name: '学生作业列表',
        meta: { title: '作业列表', }
      },
      {
        path: 'do',
        component: () => import('@/views/exam/paper/do'),
        name: 'ExamPaperPageRead',
        hidden: true,
        meta: { 
          title: '做作业',
          roles: ['STUDENT']
        }
      },
    ]
  },
  {
      path: '/student',
      name: 'select-course',
      component: Layout,
      meta: { 
        roles: ['STUDENT'],
        icon: 'table',
        title: '选课模块' 
      },
      children: [{
          path: '/course',
          name: 'select-course-list',
          component: () => import('@/views/select-course/index'),
          meta: {
            title: '课程列表',
          }
        }
      ]
  },
  {
      path: '/teacher',
      name: 'teacher-course',
      component: Layout,
      meta: { 
        roles: ['TEACHER', 'ADMIN'],
        icon: 'table',
        title: '我的课程' 
      },
      children: [{
          path: '/lesson-list',
          name: 'lesson-list',
          component: () => import('@/views/lesson/lesson-list'),
          meta: {
            title: '课程列表',
          }
        }
      ]
  },
  // // 素材管理
  // {
  //   path: '/material',
  //   component: Layout,
  //   redirect: '/material/upload',
  //   meta: {
  //     title: '素材管理',
  //     icon: 'plane',
  //     roles: ['TEACHER']
  //   },
  //   children: [{
  //       path: 'check-template',
  //       name: 'check-template',
  //       component: () => import('@/views/material/check-template'),
  //       meta: {
  //         title: '查看模板',
  //       }
  //     },
  //     {
  //       path: 'logo',
  //       name: 'logo',
  //       component: () => import('@/views/material/check-logo'),
  //       meta: {
  //         title: '查看logo',
  //       }
  //     },
  //     {
  //       path: 'generate',
  //       name: 'generate',
  //       component: () => import('@/views/material/generate'),
  //       meta: {
  //         title: '生成素材',
  //       }
  //     },
  //     {
  //       path: 'check',
  //       name: 'check',
  //       component: () => import('@/views/material/check'),
  //       meta: {
  //         title: '查看素材',
  //       }
  //     },
  //   ]
  // },

  // //测试页面
  // {
  //   path: '/',
  //   component: Layout,
  //   children: [{
  //     path: 'test',
  //     name: 'test',
  //     component: () => import('@/views/test/test'),
  //     meta: {
  //       title: '测试'
  //     }
  //   }],
  //   meta: {
  //     roles: ['TEACHER', 'STUDENT']
  //   }
  // },

  { 
    path: '*',
    redirect: '/404', 
    hidden: true 
  } // 配置重定向404页面
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export function addRouter(routes) {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  router.addRoutes(routes)
}

export default router
