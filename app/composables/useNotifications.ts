export type NotificationType = 'ticket_assigned' | 'sla_breach' | 'penalty' | 'message'

export interface AppNotification {
  id: number
  type: NotificationType
  text: string
  createdAt: string
  read: boolean
  link?: string
}

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function seed(): AppNotification[] {
  return [
    { id: 1, type: 'sla_breach', text: 'Просрочен SLA по тикету #1 (Иван Петров)', createdAt: minutesAgo(4), read: false, link: '/tickets/1' },
    { id: 2, type: 'message', text: 'Новое сообщение от Дмитрия Волкова в тикете #5', createdAt: minutesAgo(10), read: false, link: '/tickets/5' },
    { id: 3, type: 'ticket_assigned', text: 'Вам назначен тикет #8 (Мария Соколова)', createdAt: minutesAgo(30), read: false, link: '/tickets/8' },
    { id: 4, type: 'penalty', text: 'Начислен штраф 500 ₽ за нарушение SLA', createdAt: minutesAgo(80), read: true, link: '/penalties' },
    { id: 5, type: 'sla_breach', text: 'Просрочен SLA по тикету #6 (Екатерина Новикова)', createdAt: minutesAgo(120), read: true, link: '/tickets/6' },
    { id: 6, type: 'ticket_assigned', text: 'Вам назначен тикет #4 (Ольга Кузнецова)', createdAt: minutesAgo(200), read: true, link: '/tickets/4' }
  ]
}

export function useNotifications() {
  const notifications = useState<AppNotification[]>('notifications', seed)

  const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length)

  function markRead(id: number) {
    const item = notifications.value.find((n) => n.id === id)
    if (item) item.read = true
  }

  function markAllRead() {
    notifications.value.forEach((item) => (item.read = true))
  }

  return { notifications, unreadCount, markRead, markAllRead }
}
