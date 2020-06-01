import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {getId} from "@/utils/cachedata";

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/forget'] // no redirect whitelist


router.beforeEach(async(to, from, next) => {
    // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the admin has logged in
  const token = getToken()
  if (token) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (router.app.$options.store.state.user.user) {
        next()
      } else {
        try {
          // get admin info
          await store.dispatch('user/getInfo', getId())
          const role = await store.dispatch('user/getRoleInfo')
          const fixRole = []
          const roles = role.perms.split(",")
          roles.forEach(a=>{
            fixRole.push(a.split(":")[0])
          })
          const accessRoutes = await store.dispatch('permission/generateRoutes', fixRole);
          router.addRoutes(accessRoutes)
          next({...to, replace: true})
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
      NProgress.done();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
