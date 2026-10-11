

<template>
  <button @click="openCreateForm">
  Add User
</button>

<form v-if="showForm" @submit.prevent="saveUser">
  <input
    v-model="form.name"
    type="text"
    placeholder="Name"
  />

  <input
    v-model="form.email"
    type="email"
    placeholder="Email"
  />

  <input
    v-model.number="form.age"
    type="number"
    placeholder="Age"
  />

  <button type="submit">
    {{ editingUser ? 'Update' : 'Create' }}
  </button>

  <button
    type="button"
    @click="closeForm"
  >
    Cancel
  </button>
</form>

  <div>
    <h1>Users</h1>

    <DataTable
  :columns="columns"
  :data="users"
  @edit="openEditForm"
  @delete="handleDelete"
/>
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
} from '../services/api.js'
const columns = [
  {
    key: 'name',
    label: 'Name',
    filterable: true
  },
  {
    key: 'email',
    label: 'Email',
    filterable: true
  },
  {
    key: 'age',
    label: 'Age',
    filterable: true
  }
]

const users = ref([])

const showForm = ref(false)

const editingUser = ref(null)

const form = ref({
  name: '',
  email: '',
  age: null
})
onMounted(async () => {
  users.value = await getUsers()
})


const openCreateForm = () => {
  editingUser.value = null

  form.value = {
    name: '',
    email: '',
    age: null
  }

  showForm.value = true
}

const saveUser = async () => {
  if (editingUser.value) {
    const updatedUser = await updateUser(
      editingUser.value.id,
      form.value
    )

    const index = users.value.findIndex(
      user => user.id === updatedUser.id
    )

    users.value[index] = updatedUser
  } else {
    const newUser = await createUser(form.value)

    users.value.push(newUser)
  }

  closeForm()
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

const handleDelete = async (user) => {
  const confirmed = confirm(
    `Are you sure you want to delete ${user.name}?`
  )

  if (!confirmed) {
    return
  }

  await deleteUser(user.id)

  users.value = users.value.filter(
    item => item.id !== user.id
  )
}

const closeForm = () => {
  showForm.value = false
  editingUser.value = null
}
</script>