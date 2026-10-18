
import { ref, computed } from 'vue'

export function useTableManager(props) {
  const searchQuery = ref('')
  const selectedFilter = ref('')

  const showSorting = ref(false)
  const selectedSortColumn = ref('')
  const sortDirection = ref('asc')

  const filterableColumns = computed(() =>
    props.columns.filter(column => column.filterable)
  )

  const sortableColumns = computed(() =>
    props.columns.filter(column => column.sortable !== false)
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

  const sortedData = computed(() => {
    const result = [...filteredData.value]
    const key = selectedSortColumn.value

    if (!key) return result

    result.sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]

      const aEmpty = aValue == null || aValue === ''
      const bEmpty = bValue == null || bValue === ''

      if (aEmpty || bEmpty) {
        if (aEmpty && bEmpty) return 0
        return aEmpty ? 1 : -1
      }

      const aNumber = Number(aValue)
      const bNumber = Number(bValue)

      const isNumeric =
        String(aValue).trim() !== '' &&
        String(bValue).trim() !== '' &&
        Number.isFinite(aNumber) &&
        Number.isFinite(bNumber)

      const comparison = isNumeric
        ? aNumber - bNumber
        : String(aValue).localeCompare(
            String(bValue),
            undefined,
            {
              sensitivity: 'base',
              numeric: true
            }
          )

      return sortDirection.value === 'asc'
        ? comparison
        : -comparison
    })

    return result
  })

  const resetSorting = () => {
    selectedSortColumn.value = ''
    sortDirection.value = 'asc'
  }

  return {
    searchQuery,
    selectedFilter,
    showSorting,
    selectedSortColumn,
    sortDirection,
    filterableColumns,
    sortableColumns,
    sortedData,
    resetSorting
  }
}
