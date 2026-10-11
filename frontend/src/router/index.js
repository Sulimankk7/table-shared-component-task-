import { createRouter, createWebHistory } from 'vue-router'

import UsersView from '../views/UsersView.vue'
import ProductsView from '../views/ProductsView.vue'

import OrdersView from '../views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/users'
    },
    {
      path: '/users',
      component: UsersView
    },
    {
      path: '/products',
      component: ProductsView
    },
    {
      path: '/orders',
      component: OrdersView
    }
  ]
})

export default router