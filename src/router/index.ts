import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/MapOnline.vue')
    },
    {
      path: '/offline',
      name: 'mapOffline',
      component: () => import('../views/MapOffline.vue')
    }
  ]
})

export default router
