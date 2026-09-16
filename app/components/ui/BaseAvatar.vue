<template>
  <span class="base-avatar" :class="`base-avatar--${size}`" :style="{ background: color }">
    {{ initials }}
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; size?: 'sm' | 'md' }>(), { size: 'md' })

const initials = computed(() =>
  props.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
)

const palette = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#a855f7']

const color = computed(() => {
  const index = props.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % palette.length
  return palette[index]
})
</script>

<style scoped>
.base-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  font-weight: 600;
  flex-shrink: 0;
}

.base-avatar--md {
  width: 32px;
  height: 32px;
  font-size: 12px;
}

.base-avatar--sm {
  width: 24px;
  height: 24px;
  font-size: 10px;
}
</style>
