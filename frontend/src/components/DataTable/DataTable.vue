<template>
  <div class="data-table">
    <div class="table-controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
      />

      <select v-model="selectedFilter">
        <option value="">All Columns</option>
        <option
          v-for="column in filterableColumns"
          :key="column.key"
          :value="column.key"
        >
          {{ column.label }}
        </option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
          <th v-if="$slots.actions">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="row in filteredData" :key="row.id">
          <td v-for="column in columns" :key="column.key">
            {{ row[column.key] }}
          </td>

          <td v-if="$slots.actions">
            <slot name="actions" :row="row" />
          </td>
        </tr>

        <tr v-if="filteredData.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)">
            No results found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  }
})

const searchQuery = ref('')
const selectedFilter = ref('')

const filterableColumns = computed(() =>
  props.columns.filter(column => column.filterable)
)

const filteredData = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return props.data

  return props.data.filter(row => {
    const values = selectedFilter.value
      ? [row[selectedFilter.value]]
      : Object.values(row)

    return values.some(value =>
      String(value ?? '').toLowerCase().includes(query)
    )
  })
})
</script>
