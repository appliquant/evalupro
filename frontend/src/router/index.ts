import { createRouter, createWebHistory } from 'vue-router'
import { UserRoles } from '@/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/SignupView.vue')
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/auth/SigninView.vue')
    },

    {
      path: '/',
      name: 'search',
      component: () => import('../views/products/SearchPageView.vue')
    },

    {
      path: '/product/:id',
      name: 'product-details',
      component: () => import('../views/products/ProductDetailsView.vue')
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/managing/DashboardView.vue'),
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/manage-categories',
      name: 'manage-categories',
      component: () => import('../views/managing/ManageCategoriesView.vue'),
      meta: {
        requiresAuth: true,
        requiresRole: UserRoles.ADMIN
      }
    },

    {
      path: '/manage-products',
      name: 'manage-products',
      component: () => import('../views/managing/ManageProductsView.vue'),
      meta: {
        requiresAuth: true,
        requiresRole: UserRoles.ADMIN
      }
    },

    {
      path: '/manage-criterias',
      name: 'manage-criterias',
      component: () => import('../views/managing/ManageCriteriasView.vue'),
      meta: {
        requiresAuth: true,
        requiresRole: UserRoles.ADMIN
      }
    },

    {
      path: '/create-evaluation-tester/:id',
      name: 'create-evaluation-tester',
      component: () => import('../views/products/CreateEvaluationTesterView.vue'),
      meta: {
        requiresAuth: true,
        requiresRole: UserRoles.TESTER
      }
    },

    {
      path: '/manage-evaluations-tester',
      name: 'manage-evaluations-tester',
      component: () => import('../views/managing/ManageEvaluationsTesterView.vue'),
      meta: {
        requiresAuth: true,
        requiresRole: UserRoles.TESTER
      }
    },

    {
      path: '/manage-evaluations-admin',
      name: 'manage-evaluations-admin',
      component: () => import('../views/managing/ManageEvaluationsAdminView.vue'),
      meta: {
        requiresAuth: true,
        requiresRole: UserRoles.ADMIN
      }
    },

    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/managing/FavoritesView.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

export default router
