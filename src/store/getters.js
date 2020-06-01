const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  id: state => state.user.id,
  user: state => state.user.user,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
}
export default getters
