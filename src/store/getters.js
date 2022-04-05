const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatarUrl: state => state.user.avatarUrl,
  name: state => state.user.name,
  router: (state) => {
    return state.permission.router
  },
  roles: state => state.permission.roles
}
export default getters
