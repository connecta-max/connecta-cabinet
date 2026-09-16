# Connecta — Кабинет

Кабинет сотрудников и администратора Connecta CRM. Реализует «Этап 0» из технического
задания — рабочий каркас с фейковыми данными, чтобы пройти по всем экранам вживую до
подключения бэкенда.

## Запуск

```bash
npm install
npm run dev
```

Откроется на `http://localhost:3010` (порт задан в `.claude/launch.json` в корне монорепы;
для обычного `nuxt dev` без флагов будет стандартный `3000`).

**Демо-доступ:** `admin@connecta.local` / `admin123` (единственный аккаунт, см. упрощённые
роли Этапа 0 — администратор и сотрудники не разделены на уровне логина).

## Структура

```
app/
  components/     UI-компоненты — переиспользуемые, без бизнес-логики
                   (BaseButton, BaseInput, BaseModal, StatusBadge, ThemeToggle...)
  containers/      Композиция компонентов + бизнес-логика под конкретный экран
                   (TicketsList, TicketCard, EmployeeCard, SettingsSla...)
  pages/           Роуты (файловая маршрутизация Nuxt) — тонкие, просто рендерят container
  composables/      useTickets/useEmployees/useClients/usePenalties/useTemplates/useSettings —
                   фейковые данные в useState + мутации; useAuth — вход/выход
  layouts/          default (сайдбар+шапка) и blank (страница логина)
  middleware/       auth.global.ts — редирект на /login без авторизации
  types/             доменные типы (Ticket, Employee, Client, Penalty...)
i18n/locales/       ru.json / en.json — переключаются в шапке, без перезагрузки страницы
```

Каждый `.vue`-файл написан в порядке `<template>` → `<script setup>` → `<style scoped>`.

Все данные (тикеты, сотрудники, клиенты, штрафы, шаблоны) — **в памяти браузера**
(`useState`), без бэкенда. Переходы между страницами кликами сохраняют состояние; полная
перезагрузка/адрес в строке браузера сбрасывает демо-данные к исходным — это ожидаемо для
прототипа без БД.

## Экраны (соответствие пунктам ТЗ «Этап 0»)

| # | Экран | Файл страницы |
|---|---|---|
| 1 | Вход | `pages/login.vue` |
| 2 | Тикеты (список) | `pages/tickets/index.vue` |
| 3 | Карточка тикета | `pages/tickets/[id].vue` |
| 4 | Сотрудники (список) | `pages/employees/index.vue` |
| 5 | Карточка сотрудника | `pages/employees/[id].vue` |
| 6 | Штрафы (по компании) | `pages/penalties/index.vue` |
| 7 | Клиенты (список) | `pages/clients/index.vue` |
| 8 | Карточка клиента | `pages/clients/[id].vue` |
| 9 | Настройки — Каналы | `pages/settings/channels.vue` |
| 10 | Настройки — SLA и штрафы | `pages/settings/sla.vue` |
| 11 | Настройки — Шаблоны ответов | `pages/settings/templates.vue` |
| 12 | Настройки — Интерфейс | `pages/settings/interface.vue` |

Светлая/тёмная тема (`@nuxtjs/color-mode`) и RU/EN (`@nuxtjs/i18n`) — переключатели в шапке,
доступны на каждом экране с самого старта, как требует раздел 5 ТЗ.

## Дальше

Когда будет готов `connecta-api`, composables (`useTickets`, `useEmployees`, ...) — это
единственное место, которое нужно поменять: сейчас они читают/пишут в `useState`, дальше —
будут дёргать реальные эндпоинты через `$fetch`/`useFetch`, а containers и pages останутся
как есть, поскольку уже работают через эти composables, а не напрямую с данными.
