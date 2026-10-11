<template>
  <div>
    <h1>Products</h1>

    <DataTable
      :columns="columns"
      :data="products"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import DataTable from '../components/DataTable/DataTable.vue'
import { getProducts } from '../services/api.js'

const columns = [
  {
    key: 'name',
    label: 'Product',
    filterable: true
  },
  {
    key: 'price',
    label: 'Price',
    filterable: true
  },
  {
    key: 'category',
    label: 'Category',
    filterable: true
  },
  {
    key: 'stock',
    label: 'Stock',
    filterable: true
  }
]

const products = ref([])

onMounted(async () => {
  products.value = await getProducts()
})
</script>