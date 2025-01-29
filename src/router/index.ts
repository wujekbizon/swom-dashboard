import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import HarmonogramView from '@/views/dashboard/HarmonogramView.vue'
import PacjentView from '@/views/dashboard/PacjentView.vue'
import GrafikView from '@/views/dashboard/GrafikView.vue'
import OpcjeView from '@/views/dashboard/OpcjeView.vue'
import SignupView from '../views/auth/SignupView.vue'
import { authApi } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      children: [
        {
          path: 'harmonogram',
          name: 'harmonogram',
          component: HarmonogramView,
        },
        {
          path: 'pacjent',
          name: 'pacjent',
          component: PacjentView,
        },
        {
          path: 'grafik',
          name: 'grafik',
          component: GrafikView,
        },
        {
          path: 'opcje',
          name: 'opcje',
          component: OpcjeView,
        }
      ]
    }
  ],
})

// Add navigation guard
router.beforeEach(async (to) => {
  const publicPages = ['/', '/login', '/signup']
  const authRequired = !publicPages.includes(to.path)
  const auth = await authApi.getCurrentUser()

  if (authRequired && !auth) {
    return '/login'
  }
})

export default router
