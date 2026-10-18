
<template>
  <div class="data-table">
    <div class="table-controls">
      <!-- Search -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        aria-label="Search table"
      />

      <!-- Search Filter -->
      <select
        v-model="selectedFilter"
        aria-label="Filter search by column"
      >
        <option value="">All Columns</option>

        <option
          v-for="column in filterableColumns"
          :key="column.key"
          :value="column.key"
        >
          {{ column.label }}
        </option>
      </select>

      <!-- Sorting Menu -->
      <div class="sorting-menu">
        <button
          type="button"
          class="sorting-toggle"
          aria-label="Sorting options"
          :aria-expanded="showSorting"
          @click="showSorting = !showSorting"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M4 7h16" />
            <path d="M7 12h10" />
            <path d="M10 17h4" />
          </svg>

          <span>Sort</span>
        </button>

        <div
          v-if="showSorting"
          class="sorting-dropdown"
        >
          <label for="sort-column">Sort by</label>

          <select
            id="sort-column"
            v-model="selectedSortColumn"
          >
            <option value="">Default Order</option>

            <option
              v-for="column in sortableColumns"
              :key="column.key"
              :value="column.key"
            >
              {{ column.label }}
            </option>
          </select>

          <label for="sort-direction">Direction</label>

          <select
            id="sort-direction"
            v-model="sortDirection"
            :disabled="!selectedSortColumn"
          >
            <option value="asc">
              Ascending (A-Z / Low to High)
            </option>

            <option value="desc">
              Descending (Z-A / High to Low)
            </option>
          </select>

          <button
            type="button"
            class="sorting-reset"
            @click="resetSorting"
          >
            Reset Sorting
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
          >
            {{ column.label }}
          </th>

          <th v-if="$slots.actions">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in sortedData"
          :key="row.id"
        >
          <td
            v-for="column in columns"
            :key="column.key"
          >
            {{ row[column.key] }}
          </td>

          <td v-if="$slots.actions">
            <slot name="actions" :row="row" />
          </td>
        </tr>

        <tr v-if="sortedData.length === 0">
          <td
            :colspan="columns.length + ($slots.actions ? 1 : 0)"
            class="empty-state"
          >
            No results found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>

import { useTableManager } from './useTableManager.js'

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

const {
  searchQuery,
  selectedFilter,
  showSorting,
  selectedSortColumn,
  sortDirection,
  filterableColumns,
  sortableColumns,
  sortedData,
  resetSorting
} = useTableManager(props)

</script>
