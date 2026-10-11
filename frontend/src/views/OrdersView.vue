<template>
  <div>
    <h1>Orders</h1>

    <DataTable
      :columns="columns"
      :data="orders"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import DataTable from '../components/DataTable/DataTable.vue'
import { getOrders } from '../services/api.js'

const columns = [
  {
    key: 'userId',
    label: 'User',
    filterable: true
  },
  {
    key: 'productId',
    label: 'Product',
    filterable: true
  },
  {
    key: 'quantity',
    label: 'Quantity',
    filterable: true
  },
  {
    key: 'status',
    label: 'Status',
    filterable: true
  },
  {
    key: 'total',
    label: 'Total',
    filterable: true
  }
]

const orders = ref([])

onMounted(async () => {
  orders.value = await getOrders()
})
</script>