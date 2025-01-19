import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import HarmonogramView from '@/views/dashboard/HarmonogramView.vue'
import PacjentView from '@/views/dashboard/PacjentView.vue'
import GrafikView from '@/views/dashboard/GrafikView.vue'
import OpcjeView from '@/views/dashboard/OpcjeView.vue'

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

export default router
