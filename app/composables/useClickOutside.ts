import type { Ref } from 'vue'

export function useClickOutside(target: Ref<HTMLElement | null>, handler: () => void) {
  function onClick(event: MouseEvent) {
    if (target.value && !target.value.contains(event.target as Node)) handler()
  }

  onMounted(() => document.addEventListener('click', onClick))
  onBeforeUnmount(() => document.removeEventListener('click', onClick))
}
