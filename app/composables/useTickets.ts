import type { Ticket, TicketMessage, TicketNote } from '~/types'
import { useClients } from '~/composables/useClients'
import { createRng, intBetween, pick, pickWeighted } from '~/utils/random'

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function minutesFromNow(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString()
}

const heroTicketSeed: Ticket[] = [
  { id: 1, clientId: 1, status: 'in_progress', assigneeId: 1, tags: ['Оплата'], createdAt: minutesAgo(120), updatedAt: minutesAgo(3), slaDeadline: minutesAgo(5), csat: null },
  { id: 2, clientId: 2, status: 'new', assigneeId: null, tags: ['Технический'], createdAt: minutesAgo(20), updatedAt: minutesAgo(20), slaDeadline: minutesFromNow(10), csat: null },
  { id: 3, clientId: 3, status: 'closed', assigneeId: 2, tags: ['Общий'], createdAt: minutesAgo(2880), updatedAt: minutesAgo(1440), slaDeadline: minutesAgo(1400), csat: 5 },
  { id: 4, clientId: 4, status: 'in_progress', assigneeId: 2, tags: ['Возврат'], createdAt: minutesAgo(60), updatedAt: minutesAgo(10), slaDeadline: minutesFromNow(5), csat: null },
  { id: 5, clientId: 5, status: 'in_progress', assigneeId: 1, tags: ['VIP', 'API'], createdAt: minutesAgo(180), updatedAt: minutesAgo(2), slaDeadline: minutesFromNow(2), csat: null },
  { id: 6, clientId: 6, status: 'in_progress', assigneeId: 3, tags: ['Технический'], createdAt: minutesAgo(180), updatedAt: minutesAgo(90), slaDeadline: minutesAgo(120), csat: null },
  { id: 7, clientId: 1, status: 'closed', assigneeId: 1, tags: ['Общий'], createdAt: minutesAgo(7200), updatedAt: minutesAgo(7100), slaDeadline: minutesAgo(7150), csat: 4 },
  { id: 8, clientId: 2, status: 'new', assigneeId: null, tags: ['Технический', 'Срочно'], createdAt: minutesAgo(5), updatedAt: minutesAgo(5), slaDeadline: minutesFromNow(10), csat: null }
]

let msgId = 1
function msg(
  ticketId: number,
  author: 'client' | 'employee',
  authorName: string,
  authorId: number | null,
  text: string,
  minsAgo: number,
  attachments: TicketMessage['attachments'] = []
): TicketMessage {
  return { id: msgId++, ticketId, author, authorName, authorId, text, attachments, createdAt: minutesAgo(minsAgo) }
}

let attId = 1
function image(name: string, url: string) {
  return { id: attId++, kind: 'image' as const, name, url }
}
function voice(name: string, durationSec: number) {
  return { id: attId++, kind: 'voice' as const, name, durationSec }
}
function file(name: string) {
  return { id: attId++, kind: 'file' as const, name }
}

const heroMessageSeed: TicketMessage[] = [
  // Ticket #1 — busy VIP thread with image + voice attachments, long scrollable history
  msg(1, 'client', 'Иван Петров', null, 'Здравствуйте! Списали деньги дважды за подписку, разберитесь пожалуйста.', 115),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Здравствуйте, Иван! Проверяю платежи по вашему аккаунту.', 112),
  msg(1, 'client', 'Иван Петров', null, 'Хорошо, жду. Вот скриншот из банка.', 108, [image('screenshot_bank.png', '/mock/screenshot-bank.svg')]),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Вижу оба списания, спасибо. Уточняю у платёжного провайдера, что произошло.', 104),
  msg(1, 'client', 'Иван Петров', null, 'Ок, подожду. Это уже второй раз за месяц, если честно, начинаю переживать.', 100),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Понимаю ваше беспокойство, разберёмся и такого больше не повторится.', 96),
  msg(1, 'client', 'Иван Петров', null, 'Записал голосовое, чтобы подробнее объяснить ситуацию с картой.', 90, [voice('voice_message.mp3', 34)]),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Прослушала, спасибо за подробности. Уже вижу причину — повторная попытка списания из-за таймаута шлюза.', 82),
  msg(1, 'client', 'Иван Петров', null, 'Понял. То есть деньги вернутся автоматически?', 78),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Да, возврат дублирующего платежа запускаю прямо сейчас.', 74),
  msg(1, 'client', 'Иван Петров', null, 'Спасибо большое! Долго обычно возврат идёт?', 70),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Обычно 3-5 рабочих дней, зависит от банка-эмитента карты.', 66),
  msg(1, 'client', 'Иван Петров', null, 'Хорошо, буду ждать. Подскажите, а можно как-то защититься от повтора в будущем?', 60),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Мы уже внесли исправление на своей стороне, повторной проблемы быть не должно.', 52),
  msg(1, 'client', 'Иван Петров', null, 'Отлично, тогда буду проверять выписку на следующей неделе.', 45),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Договорились! Если возврат не придёт до пятницы — напишите мне в этот же тикет.', 40),
  msg(1, 'client', 'Иван Петров', null, 'Обязательно, спасибо за оперативность 🙌', 35),
  msg(1, 'employee', 'Анна Кравцова', 1, 'Пожалуйста! Тикет пока оставлю открытым до подтверждения возврата.', 3),

  // Ticket #2
  msg(2, 'client', 'Мария Соколова', null, 'Не открывается приложение после обновления.', 20),

  // Ticket #3 — closed, rated
  msg(3, 'client', 'Алексей Смирнов', null, 'Подскажите, как сменить тариф?', 2880),
  msg(3, 'employee', 'Сергей Ильин', 2, 'Сменил тариф на «Стандарт», проверьте, пожалуйста.', 1450),
  msg(3, 'client', 'Алексей Смирнов', null, 'Да, всё работает, спасибо!', 1440),

  // Ticket #4
  msg(4, 'client', 'Ольга Кузнецова', null, 'Хочу вернуть деньги за неиспользованный месяц.', 60),
  msg(4, 'employee', 'Сергей Ильин', 2, 'Оформляю возврат, зачисление займёт до 5 рабочих дней.', 10),

  // Ticket #5 — busy VIP thread, urgent API integration, image + voice from the employee side
  msg(5, 'client', 'Дмитрий Волков', null, 'Нужна срочная консультация по интеграции API.', 175),
  msg(5, 'employee', 'Анна Кравцова', 1, 'Добрый день, Дмитрий! Подключаюсь, расскажите подробнее какая ошибка.', 170),
  msg(5, 'client', 'Дмитрий Волков', null, 'При экспорте отчёта через API падает 500-я ошибка, вот скрин.', 165, [image('api_error.png', '/mock/screenshot-error.svg')]),
  msg(5, 'employee', 'Анна Кравцова', 1, 'Спасибо, вижу — это таймаут на больших выгрузках, передаю разработчикам.', 158),
  msg(5, 'client', 'Дмитрий Волков', null, 'А пока есть обходной путь? Нам нужно выгрузить отчёт сегодня.', 150),
  msg(5, 'employee', 'Анна Кравцова', 1, 'Да, можно разбить запрос по датам — до 10к строк за раз ошибки не будет.', 140),
  msg(5, 'client', 'Дмитрий Волков', null, 'Понял, попробую. Актуальный лимит по rate limit подскажете?', 132),
  msg(5, 'employee', 'Анна Кравцова', 1, 'Записала голосовое с примером запроса и параметрами пагинации.', 120, [voice('api_explanation.mp3', 51)]),
  msg(5, 'client', 'Дмитрий Волков', null, 'Отлично, послушал — то что нужно, спасибо!', 108),
  msg(5, 'employee', 'Анна Кравцова', 1, 'Рада помочь! Фикс от разработки ожидается в течение недели, сообщу отдельно.', 95),
  msg(5, 'client', 'Дмитрий Волков', null, 'Супер, будем ждать. Пока перешли на постраничную выгрузку — работает стабильно.', 60),
  msg(5, 'employee', 'Анна Кравцова', 1, 'Хорошо, держу тикет открытым до релиза фикса.', 30),
  msg(5, 'client', 'Дмитрий Волков', null, 'Кстати, а вебхуки при этом не дублируются?', 20),
  msg(5, 'employee', 'Анна Кравцова', 1, 'Нет, дедупликация по event_id работает независимо от способа выгрузки.', 10),
  msg(5, 'client', 'Дмитрий Волков', null, 'Понял, спасибо за развёрнутый ответ!', 2),

  // Ticket #6
  msg(6, 'client', 'Екатерина Новикова', null, 'Ошибка 500 при экспорте отчёта.', 180, [file('error_log.txt')]),
  msg(6, 'employee', 'Наталья Фомина', 3, 'Передала баг разработчикам, уточню сроки исправления.', 90),

  // Ticket #7
  msg(7, 'client', 'Иван Петров', null, 'Нужен совет по настройке уведомлений.', 7200),
  msg(7, 'employee', 'Анна Кравцова', 1, 'Настроила уведомления по вашему запросу, проверьте, пожалуйста.', 7150),
  msg(7, 'client', 'Иван Петров', null, 'Всё пришло, спасибо за помощь!', 7100),

  // Ticket #8
  msg(8, 'client', 'Мария Соколова', null, 'Второй день не приходит код подтверждения.', 5)
]

const heroNoteSeed: TicketNote[] = [
  { id: 1, ticketId: 1, authorName: 'Анна Кравцова', authorId: 1, text: 'Клиент уже писал по похожему поводу в прошлом месяце, см. тикет #7.', createdAt: minutesAgo(94) },
  { id: 2, ticketId: 1, authorName: 'Сергей Ильин', authorId: 2, text: 'Видел похожий кейс с таймаутом шлюза на прошлой неделе — фикс уже в бэклоге.', createdAt: minutesAgo(80) },
  { id: 3, ticketId: 5, authorName: 'Наталья Фомина', authorId: 3, text: 'VIP-клиент, интеграция важная — держим в приоритете.', createdAt: minutesAgo(168) },
  { id: 4, ticketId: 6, authorName: 'Наталья Фомина', authorId: 3, text: 'Баг воспроизводится только на больших отчётах (>10к строк).', createdAt: minutesAgo(85) }
]

const tagPool = ['Технический', 'Оплата', 'Возврат', 'Общий', 'Срочно', 'Доступ', 'Интеграция']
const genPhrasesClient = [
  'Здравствуйте, подскажите по вопросу с оплатой.',
  'Не могу войти в личный кабинет.',
  'Когда будет исправлена ошибка на сайте?',
  'Хочу уточнить статус моего обращения.',
  'Подскажите, как изменить тариф?',
  'Списались лишние средства, разберитесь пожалуйста.',
  'Приложение зависает при загрузке.',
  'Спасибо, вопрос решён!'
]
const genPhrasesEmployee = [
  'Добрый день! Уже разбираюсь с вашим вопросом.',
  'Проверил(а) аккаунт, всё исправлено.',
  'Передал(а) обращение в техническую команду.',
  'Уточните, пожалуйста, номер заказа.',
  'Готово, попробуйте обновить страницу.',
  'Рад(а) был(а) помочь!'
]

function generateTickets(count: number, startId: number, clientCount: number, employeeCount: number) {
  const rng = createRng(9001)
  const tickets: Ticket[] = []
  const messages: TicketMessage[] = []

  for (let i = 0; i < count; i++) {
    const id = startId + i
    const clientId = intBetween(rng, 1, clientCount)
    const status = pickWeighted<Ticket['status']>(rng, [
      ['new', 2],
      ['in_progress', 3],
      ['closed', 5]
    ])
    const assigneeId = status === 'new' && rng() > 0.5 ? null : intBetween(rng, 1, employeeCount)
    const ageMinutes = intBetween(rng, 5, 60 * 24 * 30)
    const createdAt = minutesAgo(ageMinutes)
    const updatedMinutesAgo = Math.max(1, ageMinutes - intBetween(rng, 0, Math.min(ageMinutes, 2000)))
    const updatedAt = minutesAgo(updatedMinutesAgo)
    const slaWindow = intBetween(rng, -180, 180)
    const slaDeadline = slaWindow >= 0 ? minutesFromNow(slaWindow) : minutesAgo(-slaWindow)
    const tagCount = intBetween(rng, 1, 2)
    const tags = Array.from(new Set(Array.from({ length: tagCount }, () => pick(rng, tagPool))))
    const csat = status === 'closed' && rng() > 0.25 ? intBetween(rng, 3, 5) : status === 'closed' && rng() > 0.7 ? intBetween(rng, 1, 2) : null

    tickets.push({ id, clientId, status, assigneeId, tags, createdAt, updatedAt, slaDeadline, csat })

    const messageCount = intBetween(rng, 1, 4)
    for (let m = 0; m < messageCount; m++) {
      const isClient = m % 2 === 0
      const minsAgo = Math.max(1, ageMinutes - m * intBetween(rng, 5, 200))
      if (isClient) {
        messages.push(msg(id, 'client', '', null, pick(rng, genPhrasesClient), minsAgo))
      } else if (assigneeId) {
        messages.push(msg(id, 'employee', '', assigneeId, pick(rng, genPhrasesEmployee), minsAgo))
      }
    }
  }

  return { tickets, messages }
}

const generated = generateTickets(92, 9, 30, 20)

let nextTicketMessageId = msgId
let nextTicketNoteId = heroNoteSeed.length + 1

export function useTickets() {
  const tickets = useState<Ticket[]>('tickets', () => structuredClone([...heroTicketSeed, ...generated.tickets]))
  const messages = useState<TicketMessage[]>('ticket-messages', () => structuredClone([...heroMessageSeed, ...generated.messages]))
  const notes = useState<TicketNote[]>('ticket-notes', () => structuredClone(heroNoteSeed))
  const { getClient } = useClients()

  function getTicket(id: number): Ticket | undefined {
    return tickets.value.find((ticket) => ticket.id === id)
  }

  function clientTypeOf(ticket: Ticket): 'free' | 'paid' | 'vip' {
    return getClient(ticket.clientId)?.type ?? 'free'
  }

  function isSlaBreached(ticket: Ticket): boolean {
    if (ticket.status === 'closed') return false
    return new Date(ticket.slaDeadline).getTime() < Date.now()
  }

  const sortedTickets = computed(() => {
    const priority = { vip: 0, paid: 1, free: 2 }
    return [...tickets.value].sort((a, b) => {
      const priorityDiff = priority[clientTypeOf(a)] - priority[clientTypeOf(b)]
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  })

  function messagesFor(ticketId: number) {
    return computed(() =>
      messages.value
        .filter((message) => message.ticketId === ticketId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    )
  }

  function notesFor(ticketId: number) {
    return computed(() =>
      notes.value.filter((note) => note.ticketId === ticketId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    )
  }

  function addMessage(ticketId: number, text: string, authorName: string, authorId: number | null, attachments: TicketMessage['attachments'] = []) {
    messages.value.push({
      id: nextTicketMessageId++,
      ticketId,
      author: 'employee',
      authorName,
      authorId,
      text,
      attachments,
      createdAt: new Date().toISOString()
    })
    const ticket = getTicket(ticketId)
    if (ticket) ticket.updatedAt = new Date().toISOString()
  }

  function addNote(ticketId: number, text: string, authorName: string, authorId: number | null) {
    notes.value.push({ id: nextTicketNoteId++, ticketId, authorName, authorId, text, createdAt: new Date().toISOString() })
  }

  function updateStatus(ticketId: number, status: Ticket['status']) {
    const ticket = getTicket(ticketId)
    if (ticket) {
      ticket.status = status
      ticket.updatedAt = new Date().toISOString()
    }
  }

  function assignEmployee(ticketId: number, employeeId: number | null) {
    const ticket = getTicket(ticketId)
    if (ticket) ticket.assigneeId = employeeId
  }

  function addTag(ticketId: number, tag: string) {
    const ticket = getTicket(ticketId)
    if (ticket && !ticket.tags.includes(tag)) ticket.tags.push(tag)
  }

  function removeTag(ticketId: number, tag: string) {
    const ticket = getTicket(ticketId)
    if (ticket) ticket.tags = ticket.tags.filter((existing) => existing !== tag)
  }

  return {
    tickets,
    sortedTickets,
    getTicket,
    clientTypeOf,
    isSlaBreached,
    messagesFor,
    notesFor,
    addMessage,
    addNote,
    updateStatus,
    assignEmployee,
    addTag,
    removeTag
  }
}
