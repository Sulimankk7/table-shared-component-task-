<template>
  <nav>
    <RouterLink to="/users">Users</RouterLink>
    <RouterLink to="/products">Products</RouterLink>
    <RouterLink to="/orders">Orders</RouterLink>
  </nav>

  <main>
    <RouterView />
  </main>
</template>