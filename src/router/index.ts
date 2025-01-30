import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import HarmonogramView from '@/views/dashboard/HarmonogramView.vue'
import PacjentView from '@/views/dashboard/PacjentView.vue'
import GrafikView from '@/views/dashboard/GrafikView.vue'
import OpcjeView from '@/views/dashboard/OpcjeView.vue'
import SignupView from '../views/auth/SignupView.vue'
import PatientDetailsView from '../views/dashboard/PatientDetailsView.vue'
import PatientHealthView from '../views/dashboard/PatientHealthView.vue'
import { useAuth } from '@/composables/useAuth'

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
          path: 'patients',
          name: 'patients',
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
    },
    {
      path: '/dashboard/patients/:id',
      name: 'pacjent-szczegoly',
      component: PatientDetailsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/patients/:id/parametry',
      name: 'pacjent-parametry',
      component: PatientHealthView,
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach(async (to) => {
  const publicPages = ['/', '/login', '/signup']
  const authRequired = !publicPages.includes(to.path)
  
  const { checkAuth } = useAuth()
  const user = await checkAuth()

  if (authRequired && !user) {
    return '/login'
  }
})

export default router
