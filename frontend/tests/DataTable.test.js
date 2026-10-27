
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataTable from '../src/components/DataTable/DataTable.vue'

describe('DataTable.vue', () => {
  const columns = [
    { key: 'name', label: 'Name', filterable: true },
    { key: 'age', label: 'Age', filterable: true },
  ]

  const data = [
    { id: 1, name: 'Suliman', age: 21 },
    { id: 2, name: 'Ahmad', age: 23 },
  ]

  describe('Rendering', () => {
    it('renders the table columns correctly', () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      expect(wrapper.text()).toContain('Name')
      expect(wrapper.text()).toContain('Age')
    })

    it('renders the provided data', () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      expect(wrapper.text()).toContain('Suliman')
      expect(wrapper.text()).toContain('Ahmad')
      expect(wrapper.text()).toContain('21')
      expect(wrapper.text()).toContain('23')
    })
  })

  describe('Search and Filtering', () => {
    it('filters rows when searching by name', async () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      await wrapper
        .get('input[aria-label="Search table"]')
        .setValue('Suliman')

      expect(wrapper.text()).toContain('Suliman')
      expect(wrapper.text()).not.toContain('Ahmad')
    })

    it('shows an empty state when no rows match', async () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      await wrapper
        .get('input[aria-label="Search table"]')
        .setValue('Nonexistent')

      expect(wrapper.text()).toContain('No results found')
    })

    it('filters search by the selected column', async () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      await wrapper
        .get('select[aria-label="Filter search by column"]')
        .setValue('name')

      await wrapper
        .get('input[aria-label="Search table"]')
        .setValue('21')

      expect(wrapper.text()).toContain('No results found')
      expect(wrapper.text()).not.toContain('Suliman')
    })

    it('searches all columns when All Columns is selected', async () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      await wrapper
        .get('input[aria-label="Search table"]')
        .setValue('21')

      expect(wrapper.text()).toContain('Suliman')
      expect(wrapper.text()).not.toContain('Ahmad')
    })

    it('searches case-insensitively and trims whitespace', async () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      await wrapper
        .get('input[aria-label="Search table"]')
        .setValue('  sULiMaN  ')

      expect(wrapper.text()).toContain('Suliman')
      expect(wrapper.text()).not.toContain('Ahmad')
    })

    it('handles null and undefined values during search', async () => {
  const dataWithMissingValues = [
    { id: 1, name: null, age: 21 },
    { id: 2, name: undefined, age: 23 },
    { id: 3, name: 'Suliman', age: 25 },
  ]

  const wrapper = mount(DataTable, {
    props: {
      columns,
      data: dataWithMissingValues,
    },
  })

  await wrapper.get('[aria-label="Search table"]').setValue('suliman')

  const rows = wrapper.findAll('tbody tr')

  expect(rows).toHaveLength(1)
  expect(rows[0].text()).toContain('Suliman')
})
  })

  describe('Sorting', () => {
    it('sorts names in ascending order', async () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      await wrapper
        .get('[aria-label="Sorting options"]')
        .trigger('click')

      await wrapper.get('#sort-column').setValue('name')

      const names = wrapper
        .findAll('tbody tr')
        .filter(row => row.findAll('td').length > 0)
        .map(row => row.findAll('td')[0].text())

      expect(names).toEqual(['Ahmad', 'Suliman'])
    })

    it('sorts names in descending order', async () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      await wrapper
        .get('[aria-label="Sorting options"]')
        .trigger('click')

      await wrapper.get('#sort-column').setValue('name')
      await wrapper.get('#sort-direction').setValue('desc')

      const names = wrapper
        .findAll('tbody tr')
        .filter(row => row.findAll('td').length > 0)
        .map(row => row.findAll('td')[0].text())

      expect(names).toEqual(['Suliman', 'Ahmad'])
    })

    it('sorts numeric values in ascending order', async () => {
      const unorderedData = [
        { id: 1, name: 'Ahmad', age: 23 },
        { id: 2, name: 'Suliman', age: 21 },
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns,
          data: unorderedData,
        },
      })

      await wrapper
        .get('[aria-label="Sorting options"]')
        .trigger('click')

      await wrapper.get('#sort-column').setValue('age')

      const ages = wrapper
        .findAll('tbody tr')
        .filter(row => row.findAll('td').length > 0)
        .map(row => Number(row.findAll('td')[1].text()))

      expect(ages).toEqual([21, 23])
    })

    it('places empty values at the end when sorting ascending', async () => {
      const dataWithEmptyValues = [
        { id: 1, name: 'Ahmad', age: 23 },
        { id: 2, name: 'Zaid', age: null },
        { id: 3, name: 'Omar', age: 21 },
        { id: 4, name: 'Ali', age: '' },
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns,
          data: dataWithEmptyValues,
        },
      })

      await wrapper
        .get('[aria-label="Sorting options"]')
        .trigger('click')

      await wrapper.get('#sort-column').setValue('age')

      const ages = wrapper
        .findAll('tbody tr')
        .filter(row => row.findAll('td').length > 0)
        .map(row => row.findAll('td')[1].text().trim())

      expect(ages).toEqual(['21', '23', '', ''])
    })

    it('places empty values at the end when sorting descending', async () => {
      const dataWithEmptyValues = [
        { id: 1, name: 'Ahmad', age: 23 },
        { id: 2, name: 'Zaid', age: null },
        { id: 3, name: 'Omar', age: 21 },
        { id: 4, name: 'Ali', age: '' },
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns,
          data: dataWithEmptyValues,
        },
      })

      await wrapper
        .get('[aria-label="Sorting options"]')
        .trigger('click')

      await wrapper.get('#sort-column').setValue('age')
      await wrapper.get('#sort-direction').setValue('desc')

      const ages = wrapper
        .findAll('tbody tr')
        .filter(row => row.findAll('td').length > 0)
        .map(row => row.findAll('td')[1].text().trim())

      expect(ages).toEqual(['23', '21', '', ''])
    })

    it('resets sorting to the default state', async () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      await wrapper
        .get('[aria-label="Sorting options"]')
        .trigger('click')

      await wrapper.get('#sort-column').setValue('name')
      await wrapper.get('#sort-direction').setValue('desc')

      await wrapper.get('button.sorting-reset').trigger('click')

      expect(wrapper.get('#sort-column').element.value).toBe('')
      expect(wrapper.get('#sort-direction').element.value).toBe('asc')
    })

    it('does not offer columns that are not sortable', async () => {
      const nonSortableColumns = [
        { key: 'name', label: 'Name', filterable: true },
        {
          key: 'age',
          label: 'Age',
          filterable: true,
          sortable: false,
        },
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns: nonSortableColumns,
          data,
        },
      })

      await wrapper
        .get('[aria-label="Sorting options"]')
        .trigger('click')

      const sortColumnOptions = wrapper
        .get('#sort-column')
        .findAll('option')
        .map(option => option.text())

      expect(sortColumnOptions).toContain('Name')
      expect(sortColumnOptions).not.toContain('Age')
    })

    it('handles two empty values while sorting', async () => {
      const dataWithEmptyValues = [
        { id: 1, name: 'Ahmad', age: null },
        { id: 2, name: 'Suliman', age: '' },
        { id: 3, name: 'Zaid', age: 21 },
      ]

      const wrapper = mount(DataTable, {
        props: {
          columns,
          data: dataWithEmptyValues,
        },
      })

      await wrapper
        .get('[aria-label="Sorting options"]')
        .trigger('click')

      await wrapper.get('#sort-column').setValue('age')

      const names = wrapper
        .findAll('tbody tr')
        .filter(row => row.findAll('td').length > 0)
        .map(row => row.findAll('td')[0].text())

      expect(names[0]).toBe('Zaid')
      expect(names.slice(1)).toHaveLength(2)
      expect(names.slice(1)).toContain('Ahmad')
      expect(names.slice(1)).toContain('Suliman')
    })
  })

  describe('Actions Slot', () => {
    it('does not render the Actions column when no slot is provided', () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
      })

      expect(wrapper.text()).not.toContain('Actions')
    })

    it('renders the Actions column and slot content when provided', () => {
      const wrapper = mount(DataTable, {
        props: { columns, data },
        slots: {
          actions: '<button class="edit-button">Edit</button>',
        },
      })

      expect(wrapper.text()).toContain('Actions')
      expect(wrapper.findAll('.edit-button')).toHaveLength(2)
    })

    it('sets colspan correctly when actions slot is provided', () => {
  const wrapper = mount(DataTable, {
    props: {
      columns,
      data: [],
    },
    slots: {
      actions: '<button>Edit</button>',
    },
  })

  expect(wrapper.find('.empty-state').attributes('colspan')).toBe('3')
})

it('sets colspan correctly when actions slot is not provided', () => {
  const wrapper = mount(DataTable, {
    props: {
      columns,
      data: [],
    },
  })

  expect(wrapper.find('.empty-state').attributes('colspan')).toBe('2')
})
  })
})
