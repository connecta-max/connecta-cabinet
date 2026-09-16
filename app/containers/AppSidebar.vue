<template>
  <ClientOnly>
    <div v-if="isOpen" class="app-sidebar__backdrop" @click="close" />
  </ClientOnly>
  <aside class="app-sidebar" :class="{ 'app-sidebar--open': isOpen }">
    <nav class="app-sidebar__nav-main">
      <NuxtLink to="/tickets" class="app-sidebar__link" active-class="app-sidebar__link--active" @click="close">
        <Ticket :size="18" />
        {{ t('nav.tickets') }}
      </NuxtLink>
      <NuxtLink v-if="canViewEmployees" to="/employees" class="app-sidebar__link" active-class="app-sidebar__link--active" @click="close">
        <Users :size="18" />
        {{ t('nav.employees') }}
      </NuxtLink>
      <NuxtLink to="/penalties" class="app-sidebar__link" active-class="app-sidebar__link--active" @click="close">
        <AlertTriangle :size="18" />
        {{ isAdmin ? t('nav.penalties') : t('nav.myPenalties') }}
      </NuxtLink>
      <NuxtLink v-if="canViewClients" to="/clients" class="app-sidebar__link" active-class="app-sidebar__link--active" @click="close">
        <Contact :size="18" />
        {{ t('nav.clients') }}
      </NuxtLink>
    </nav>

    <div v-if="canViewSettings" ref="settingsMenuEl" class="app-sidebar__nav-bottom">
      <button
        type="button"
        class="app-sidebar__link app-sidebar__settings-trigger"
        :class="{ 'app-sidebar__link--active': isSettingsRoute }"
        @click="settingsMenuOpen = !settingsMenuOpen"
      >
        <Settings :size="18" />
        {{ t('nav.settings') }}
      </button>

      <div v-if="settingsMenuOpen" class="app-sidebar__settings-panel">
        <NuxtLink to="/settings/channels" class="app-sidebar__settings-item" active-class="app-sidebar__settings-item--active" @click="onSettingsSelect">
          {{ t('settingsNav.channels') }}
        </NuxtLink>
        <NuxtLink to="/settings/sla" class="app-sidebar__settings-item" active-class="app-sidebar__settings-item--active" @click="onSettingsSelect">
          {{ t('settingsNav.sla') }}
        </NuxtLink>
        <NuxtLink to="/settings/templates" class="app-sidebar__settings-item" active-class="app-sidebar__settings-item--active" @click="onSettingsSelect">
          {{ t('settingsNav.templates') }}
        </NuxtLink>
        <NuxtLink to="/settings/interface" class="app-sidebar__settings-item" active-class="app-sidebar__settings-item--active" @click="onSettingsSelect">
          {{ t('settingsNav.interface') }}
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { AlertTriangle, Contact, Settings, Ticket, Users } from '@lucide/vue'

const { t } = useI18n()
const { isAdmin, canViewEmployees, canViewClients, canViewSettings } = usePermissions()
const { isOpen, close } = useMobileNav()

const route = useRoute()
const isSettingsRoute = computed(() => route.path.startsWith('/settings'))

const settingsMenuOpen = ref(false)
const settingsMenuEl = ref<HTMLElement | null>(null)
useClickOutside(settingsMenuEl, () => (settingsMenuOpen.value = false))

function onSettingsSelect() {
  settingsMenuOpen.value = false
  close()
}
</script>

<style scoped>
.app-sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 16px 12px;
}

.app-sidebar__nav-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-sidebar__nav-bottom {
  position: relative;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.app-sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
}

.app-sidebar__link svg {
  flex-shrink: 0;
}

.app-sidebar__link:hover {
  background: var(--color-surface-alt);
  color: var(--color-text);
}

.app-sidebar__link--active {
  background: var(--color-surface-alt);
  color: var(--color-accent);
  font-weight: 600;
}

.app-sidebar__settings-trigger {
  width: 100%;
  border: none;
  background: none;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
}

.app-sidebar__settings-panel {
  position: absolute;
  z-index: 30;
  bottom: calc(100% + 4px);
  left: 0;
  right: 0;
  padding: 6px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-sidebar__settings-item {
  padding: 9px 12px;
  border-radius: 8px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 13px;
}

.app-sidebar__settings-item:hover {
  background: var(--color-surface-alt);
  color: var(--color-text);
}

.app-sidebar__settings-item--active {
  background: var(--color-accent-bg);
  color: var(--color-accent);
  font-weight: 600;
}

.app-sidebar__backdrop {
  display: none;
}

@media (max-width: 900px) {
  .app-sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 60;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    box-shadow: 12px 0 24px rgba(0, 0, 0, 0.25);
    overflow-y: auto;
  }

  .app-sidebar--open {
    transform: translateX(0);
  }

  .app-sidebar__backdrop {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.45);
  }
}
</style>
