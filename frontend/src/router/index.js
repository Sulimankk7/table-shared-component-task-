import { createRouter, createWebHistory } from 'vue-router'

import UsersView from '../views/UsersView.vue'
import ProductsView from '../views/ProductsView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: '/', redirect: '/users' },
    { path: '/users', component: UsersView },
    { path: '/products', component: ProductsView }
  ]
})

export default router
