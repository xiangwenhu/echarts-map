import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/online',
      name: 'mapOnline',
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
