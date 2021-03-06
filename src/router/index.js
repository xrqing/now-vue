import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Admin from '@/components/admin/admin.vue'
import Rights from '@/components/power/Rights.vue'
import Menu from '@/components/menu/Menu.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          name: 'Welcome',
          path: '/welcome',
          component: Welcome
        },
        {
          name: 'admin',
          path: '/admin/list',
          component: Admin
        },
        {
          name: 'rights',
          path: '/rights/list',
          component: Rights
        },
        {
          name: 'menu',
          path: '/menu/list',
          component: Menu
        }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
