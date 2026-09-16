<template>
  <div class="app-shell">
    <AppHeader />
    <div class="app-shell__body">
      <AppSidebar />
      <main class="app-shell__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-shell__body {
  position: relative;
  flex: 1;
  display: flex;
  min-height: 0;
}

.app-shell__content {
  flex: 1;
  min-width: 0;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
}

@media (max-width: 640px) {
  .app-shell__content {
    padding: 14px;
  }
}
</style>
