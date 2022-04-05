/* eslint-disable prefer-const */
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { getToken, getRole } from '@/utils/auth'
import store from './store'
import { addRouter } from './router'
import getters from './store/getters'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404', '/register'] // no redirect whitelist

// router.beforeEach(function (to, from, next) {

//   if (auth.getToken()) {
//     // 请求路径为登录页面时跳转到首页
//     if (to.path === '/login') {
//       next({ path: '/'} )
//     } else {

//     }
//   }
//   // 如果需要登录
//   if (to.meta.needLogin) {
    
//   }
// })

let a = 1

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  let token = getToken()
  let role = getRole()
  
  // 判断登录状态
  if (token) {
    console.log(to.path);
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      let beforeRoute = store.getters.router
      console.log(beforeRoute);
      
      if (store.getters.router !== '') {
        next()
        
      } else {
        store.dispatch('setUserInfo').then(() => {
          store.dispatch('getAsyncRoutes', role).then(routes => {
            addRouter(routes)
            router.options.routes = routes
            next({ ...to, replace: true }) 
            // 保证路由已挂载
            NProgress.done()
          })
        })

      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasLogin = localStorage.getItem('hasLogin')
//   if (hasLogin) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       next()
//       NProgress.done()
//     }
//     if (to.path === '/user/user') {
//       let id = JSON.parse(localStorage.getItem('userInfo')).id
//       console.log(id)
//       if (id > 2) {
//         next({ path: '/task' })
//         window.alert('permission denied')
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
