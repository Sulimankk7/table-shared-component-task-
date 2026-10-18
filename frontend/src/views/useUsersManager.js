
import { ref, onMounted } from 'vue'
import { usersService } from '../services/users.service.js'

const emptyForm = () => ({
  name: '',
  email: '',
  age: null
})

export function useUsersManager() {
  const users = ref([])
  const form = ref(emptyForm())
  const showForm = ref(false)
  const editingUser = ref(null)
  const error = ref('')

  const loadUsers = async () => {
    try {
      error.value = ''
      users.value = await usersService.getAll()
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
        const updated = await usersService.update(
          editingUser.value.id,
          form.value
        )

        const index = users.value.findIndex(
          user => user.id === updated.id
        )

        if (index !== -1) {
          users.value[index] = updated
        }
      } else {
        users.value.push(
          await usersService.create(form.value)
        )
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
      await usersService.remove(user.id)
      users.value = users.value.filter(
        item => item.id !== user.id
      )
    } catch (e) {
      error.value = e.message || 'Could not delete user'
    }
  }

  return {
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
  }
}
