<template>
  <div>
    <h1>Users</h1>

    <button @click="openCreateForm">Add User</button>

    <form v-if="showForm" @submit.prevent="saveUser">
      <input v-model="form.name" type="text" placeholder="Name" required />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model.number="form.age" type="number" placeholder="Age" required />

      <button type="submit">{{ editingUser ? 'Update' : 'Create' }}</button>
      <button type="button" @click="closeForm">Cancel</button>
    </form>

    <p v-if="error">{{ error }}</p>

    <DataTable :columns="columns" :data="users">
      <template #actions="{ row }">
        <button type="button" @click="openEditForm(row)">Edit</button>
        <button type="button" @click="handleDelete(row)">Delete</button>
      </template>
    </DataTable>
  </div>
</template>

<script setup>

import DataTable from '../components/DataTable/DataTable.vue'
import { useUsersManager } from './useUsersManager.js'

const columns = [
  { key: 'name', label: 'Name', filterable: true },
  { key: 'email', label: 'Email', filterable: true },
  { key: 'age', label: 'Age', filterable: true }
]

const {
  users,
  form,
  showForm,
  editingUser,
  error,
  openCreateForm,
  openEditForm,
  closeForm,
  saveUser,
  handleDelete
} = useUsersManager()

</script>
