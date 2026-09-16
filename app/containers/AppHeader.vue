<template>
  <header class="app-header">
    <button type="button" class="app-header__burger" :aria-label="t('header.menu')" @click="toggleMobileNav">
      <Menu :size="20" />
    </button>
    <AppLogo :height="32" />
    <div class="app-header__spacer" />
    <NotificationsBell class="app-header__notifications" />
    <ThemeToggle class="app-header__theme" />
    <LocaleSwitch class="app-header__locale" />
    <div ref="userMenuEl" class="app-header__user">
      <button type="button" class="app-header__user-trigger" @click="userMenuOpen = !userMenuOpen">
        <BaseAvatar :name="currentEmployee?.fullName || 'Admin'" size="sm" />
        <span class="app-header__user-name">{{ currentEmployee?.fullName }}</span>
        <ChevronDown :size="14" class="app-header__user-chevron" :class="{ 'app-header__user-chevron--open': userMenuOpen }" />
      </button>

      <div v-if="userMenuOpen" class="app-header__user-panel">
        <div class="app-header__user-card">
          <BaseAvatar :name="currentEmployee?.fullName || 'Admin'" />
          <div class="app-header__user-card-text">
            <p class="app-header__user-card-name">{{ currentEmployee?.fullName }}</p>
            <p class="app-header__user-card-email">{{ currentEmployee?.email }}</p>
          </div>
        </div>

        <div class="app-header__user-list">
          <button type="button" class="app-header__user-item" @click="onProfile">
            <User :size="16" />
            {{ t('header.profile') }}
          </button>
          <NuxtLink v-if="canViewSettings" to="/settings/interface" class="app-header__user-item" @click="userMenuOpen = false">
            <Settings :size="16" />
            {{ t('nav.settings') }}
          </NuxtLink>
        </div>

        <div class="app-header__user-list">
          <button type="button" class="app-header__user-item app-header__user-item--danger" @click="onLogout">
            <LogOut :size="16" />
            {{ t('header.logout') }}
          </button>
        </div>
      </div>
    </div>

    <PersonInfoModal v-model="profileModalOpen" person-type="employee" :person-id="currentEmployeeId" />
  </header>
</template>

<script setup lang="ts">
import { ChevronDown, LogOut, Menu, Settings, User } from '@lucide/vue'

const { t } = useI18n()
const { currentEmployee, currentEmployeeId, logout } = useAuth()
const { canViewSettings } = usePermissions()
const { toggle: toggleMobileNav } = useMobileNav()

const userMenuOpen = ref(false)
const userMenuEl = ref<HTMLElement | null>(null)
useClickOutside(userMenuEl, () => (userMenuOpen.value = false))

const profileModalOpen = ref(false)

function onProfile() {
  userMenuOpen.value = false
  profileModalOpen.value = true
}

function onLogout() {
  userMenuOpen.value = false
  logout()
  navigateTo('/login')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.app-header__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-alt);
  color: var(--color-text);
  cursor: pointer;
  flex-shrink: 0;
}

.app-header__spacer {
  flex: 1;
}

.app-header__user {
  position: relative;
  padding-left: 12px;
  border-left: 1px solid var(--color-border);
}

.app-header__user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: none;
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text);
}

.app-header__user-trigger:hover {
  background: var(--color-surface-alt);
}

.app-header__user-name {
  font-size: 13px;
  font-weight: 500;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header__user-chevron {
  color: var(--color-text-muted);
  transition: transform 0.15s ease;
}

.app-header__user-chevron--open {
  transform: rotate(180deg);
}

.app-header__user-panel {
  position: absolute;
  z-index: 30;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.app-header__user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.app-header__user-card-text {
  min-width: 0;
}

.app-header__user-card-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header__user-card-email {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header__user-list {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--color-border);
}

.app-header__user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border: none;
  border-radius: 7px;
  background: none;
  color: var(--color-text);
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.app-header__user-item:hover {
  background: var(--color-surface-alt);
}

.app-header__user-item--danger {
  color: var(--color-danger);
}

.app-header__user-item--danger:hover {
  background: var(--color-danger-bg);
}

@media (max-width: 900px) {
  .app-header__burger {
    display: inline-flex;
  }

  .app-header__user-name {
    display: none;
  }
}

@media (max-width: 640px) {
  .app-header {
    padding: 10px 12px;
    gap: 8px;
    flex-wrap: wrap;
  }

  .app-header__notifications {
    order: 1;
  }

  .app-header__theme {
    order: 2;
  }

  .app-header__locale {
    order: 3;
  }

  .app-header__user {
    order: 4;
  }
}
</style>
