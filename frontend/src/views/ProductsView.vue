<template>
  <div>
    <h1>Products</h1>

    <p v-if="error">{{ error }}</p>

    <DataTable :columns="columns" :data="products" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import DataTable from '../components/DataTable/DataTable.vue'
import { productsService } from '../services/products.service.js'

const columns = [
  { key: 'name', label: 'Product', filterable: true },
  { key: 'price', label: 'Price', filterable: true },
  { key: 'category', label: 'Category', filterable: true },
  { key: 'stock', label: 'Stock', filterable: true }
]

const products = ref([])
const error = ref('')

onMounted(async () => {
  try {
    products.value = await productsService.getAll()
  } catch (e) {
    error.value = e.message || 'Could not load products'
  }
})
</script>
