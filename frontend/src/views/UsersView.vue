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
import { ref, onMounted } from 'vue'

import DataTable from '../components/DataTable/DataTable.vue'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/users.service.js'

const columns = [
  { key: 'name', label: 'Name', filterable: true },
  { key: 'email', label: 'Email', filterable: true },
  { key: 'age', label: 'Age', filterable: true }
]

const emptyForm = () => ({ name: '', email: '', age: null })

const users = ref([])
const form = ref(emptyForm())
const showForm = ref(false)
const editingUser = ref(null)
const error = ref('')

const loadUsers = async () => {
  try {
    error.value = ''
    users.value = await getUsers()
  } catch (e) {
    error.value = e.message || 'Could not load users'
  }
}

onMounted(loadUsers)

const openCreateForm = () => {
  editingUser.value = null
  form.value = emptyForm()
  showForm.value = true
}

const openEditForm = (user) => {
  editingUser.value = user
  form.value = {
    name: user.name,
    email: user.email,
    age: user.age
  }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingUser.value = null
  form.value = emptyForm()
}

const saveUser = async () => {
  try {
    error.value = ''

    if (editingUser.value) {
      const updated = await updateUser(editingUser.value.id, form.value)
      const index = users.value.findIndex(user => user.id === updated.id)

      if (index !== -1) users.value[index] = updated
    } else {
      users.value.push(await createUser(form.value))
    }

    closeForm()
  } catch (e) {
    error.value = e.message || 'Could not save user'
  }
}

const handleDelete = async (user) => {
  if (!confirm(`Delete ${user.name}?`)) return

  try {
    error.value = ''
    await deleteUser(user.id)
    users.value = users.value.filter(item => item.id !== user.id)
  } catch (e) {
    error.value = e.message || 'Could not delete user'
  }
}
</script>
