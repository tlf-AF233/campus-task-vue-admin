import { constantRoutes, asyncRoutes } from '../../router/index'

/**
 * 通过meta中的roles信息判断用户是否有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  roles = roles.split(',')
  if (route.meta && route.meta.roles) {
    
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 根据角色和配置生成当前用户的路由
 * @param {array} constantRoutes 配置的路由
 * @param {array} roles 用户角色
 */
let GenerateRoutes = (constantRoutes, roles) => {
  let res = []
  constantRoutes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = GenerateRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
const permission = {
  state: {
    roles: [],
    router: '' // 用于配置页面导航等
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTES: (state, router) => {
      state.router = router
    },
    RESET_ROUTES: (state) => {
      state.router = ''
    }
  },
  actions: {
    /**根据角色获取路由配置,并保存用户角色 */
    getAsyncRoutes({ commit }, roles) {
      let filterRoutes = GenerateRoutes(asyncRoutes, roles)
      
      let res = constantRoutes.concat(filterRoutes)
      
      commit('SET_ROUTES', res)
      return res
    },
    
    resetRoutes({ commit }) {
      commit('RESET_ROUTES')
    }
  }
}
export default permission