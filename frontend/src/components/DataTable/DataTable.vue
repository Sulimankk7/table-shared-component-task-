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
          v-for="column in columns.filter(column => column.filterable)"
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
          <th
            v-for="column in columns"
            :key="column.key"
          >
            {{ column.label }}
          </th>

          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in filteredData"
          :key="row.id"
        >
          <td
            v-for="column in columns"
            :key="column.key"
          >
            {{ row[column.key] }}
          </td>

          <td>
            <button @click="emit('edit', row)">
              Edit
            </button>

            <button @click="emit('delete', row)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['edit', 'delete'])

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

const filteredData = computed(() => {
  if (!searchQuery.value) {
    return props.data
  }

  return props.data.filter(row => {
    if (selectedFilter.value) {
      return String(row[selectedFilter.value])
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    }

    return Object.values(row).some(value =>
      String(value)
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    )
  })
})
</script>