import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/signup",
            name: "signup",
            component: () => import("../views/SignupView.vue")
        },
        {
            path: "/signin",
            name: "signin",
            component: () => import("../views/SigninView.vue")
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: () => import("../views/DashboardView.vue"),
            meta: {
                requiresAuth: true
            }
        },

        {
            path: "/manage-categories",
            name: "manage-categories",
            component: () => import("../views/ManageCategoriesView.vue"),
            meta: {
                requiresAuth: true
            }
        },


        {
            path: "/manage-products",
            name: "manage-products",
            component: () => import("../views/ManageProductsView.vue"),
            meta: {
                requiresAuth: true
            }
        }
    ]
})

export default router
