<template>
  <ClientOnly>
    <img :src="colorMode.value === 'dark' ? '/logo/logo-full-dark.svg' : '/logo/logo-full.svg'" alt="Connecta" class="app-logo" :style="{ height: `${height}px` }" />
    <template #fallback>
      <img src="/logo/logo-full-dark.svg" alt="Connecta" class="app-logo" :style="{ height: `${height}px` }" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ height?: number }>(), { height: 28 })
const colorMode = useColorMode()
</script>

<style scoped>
.app-logo {
  width: auto;
  display: block;
}
</style>
