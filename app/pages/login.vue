<template>
  <div class="login-page">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blank' })
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 16px;
}
</style>
