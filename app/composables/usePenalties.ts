import type { Penalty } from '~/types'
import { createRng, intBetween, pick, pickWeighted } from '~/utils/random'

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

const handAuthored: Penalty[] = [
  { id: 1, employeeId: 3, amount: 500, reason: 'Нарушение SLA по тикету #6', issuedBy: 'system', ticketId: 6, createdAt: minutesAgo(80) },
  { id: 2, employeeId: 2, amount: 1000, reason: 'Грубый тон в переписке с клиентом', issuedBy: 'Анна Кравцова', ticketId: null, createdAt: minutesAgo(1500) },
  { id: 3, employeeId: 1, amount: 300, reason: 'Опоздание с ответом на 20 минут', issuedBy: 'system', ticketId: 7, createdAt: minutesAgo(7100) },
  { id: 4, employeeId: 4, amount: 700, reason: 'Некорректно закрыл тикет без решения вопроса', issuedBy: 'Анна Кравцова', ticketId: null, createdAt: minutesAgo(4000) },
  { id: 5, employeeId: 2, amount: 500, reason: 'Нарушение SLA', issuedBy: 'system', ticketId: null, createdAt: minutesAgo(200) }
]

const reasons = [
  'Нарушение SLA по ответу',
  'Грубый тон в переписке с клиентом',
  'Некорректно закрыл тикет без решения вопроса',
  'Опоздание с ответом',
  'Ошибка при оформлении возврата',
  'Пропущенное сообщение клиента',
  'Нарушение регламента общения'
]
const issuers = ['system', 'Анна Кравцова', 'Сергей Ильин', 'Наталья Фомина']
const amounts = [300, 500, 700, 1000, 1500]

function generatePenalties(count: number, startId: number, employeeCount: number, ticketCount: number): Penalty[] {
  const rng = createRng(3113)
  const result: Penalty[] = []
  for (let i = 0; i < count; i++) {
    const hasTicket = rng() > 0.4
    result.push({
      id: startId + i,
      employeeId: intBetween(rng, 1, employeeCount),
      amount: pick(rng, amounts),
      reason: pick(rng, reasons),
      issuedBy: pickWeighted(rng, [
        ['system', 5],
        [pick(rng, issuers.slice(1)), 3]
      ] as const),
      ticketId: hasTicket ? intBetween(rng, 1, ticketCount) : null,
      createdAt: minutesAgo(intBetween(rng, 30, 60 * 24 * 60))
    })
  }
  return result
}

const seed: Penalty[] = [...handAuthored, ...generatePenalties(25, 6, 20, 100)]

let nextId = seed.length + 1

export function usePenalties() {
  const penalties = useState<Penalty[]>('penalties', () => structuredClone(seed))

  function penaltiesFor(employeeId: number) {
    return computed(() => penalties.value.filter((penalty) => penalty.employeeId === employeeId))
  }

  function issuePenalty(data: { employeeId: number; amount: number; reason: string; issuedBy: string; ticketId?: number | null }) {
    penalties.value.unshift({
      id: nextId++,
      employeeId: data.employeeId,
      amount: data.amount,
      reason: data.reason,
      issuedBy: data.issuedBy,
      ticketId: data.ticketId ?? null,
      createdAt: new Date().toISOString()
    })
  }

  return { penalties, penaltiesFor, issuePenalty }
}
