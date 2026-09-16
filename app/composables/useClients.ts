import type { Client, ClientType } from '~/types'
import { createRng, pickWeighted } from '~/utils/random'
import { translit } from '~/utils/translit'

// Names already used by hand-authored clients (below) are excluded here to avoid duplicate namesakes.
const firstNamesM = ['Артём', 'Николай', 'Виталий', 'Егор', 'Тимур', 'Владислав', 'Григорий', 'Станислав', 'Руслан', 'Кирилл', 'Богдан', 'Демид']
const lastNamesM = ['Григорьев', 'Абрамов', 'Тарасов', 'Быков', 'Родионов', 'Панов', 'Ефимов', 'Козырев', 'Мельников', 'Жуков', 'Поляков', 'Сафонов']
const firstNamesF = ['Виктория', 'Елена', 'Софья', 'Татьяна', 'Ксения', 'Анастасия', 'Валентина', 'Людмила', 'Инна', 'Алёна', 'Марина', 'Регина']
const lastNamesF = ['Белова', 'Абрамова', 'Тарасова', 'Быкова', 'Родионова', 'Панова', 'Ефимова', 'Козырева', 'Мельникова', 'Жукова', 'Полякова', 'Сафонова']
const domains = ['mail.ru', 'gmail.com', 'yandex.ru', 'outlook.com', 'bk.ru']

function generateClients(count: number, startId: number): Client[] {
  const rng = createRng(777)
  const result: Client[] = []
  for (let i = 0; i < count; i++) {
    const isMale = rng() > 0.5
    const first = isMale ? firstNamesM[i % firstNamesM.length] : firstNamesF[i % firstNamesF.length]
    const last = isMale ? lastNamesM[i % lastNamesM.length] : lastNamesF[i % lastNamesF.length]
    const fullName = `${first} ${last}`
    const emailBase = `${translit(first)}.${translit(last)}`
    const type = pickWeighted<ClientType>(rng, [
      ['free', 5],
      ['paid', 3],
      ['vip', 2]
    ])
    result.push({
      id: startId + i,
      fullName,
      email: `${emailBase}${i}@${domains[i % domains.length]}`,
      phone: `+7 9${String(10 + (i % 89)).padStart(2, '0')} ${String(100 + i).slice(-3)}-${String(10 + (i * 7) % 90).padStart(2, '0')}-${String(10 + (i * 13) % 90).padStart(2, '0')}`,
      type
    })
  }
  return result
}

const handAuthored: Client[] = [
  { id: 1, fullName: 'Иван Петров', email: 'ivan.petrov@mail.ru', phone: '+7 900 111-22-33', type: 'vip' },
  { id: 2, fullName: 'Мария Соколова', email: 'm.sokolova@gmail.com', phone: '+7 900 222-33-44', type: 'paid' },
  { id: 3, fullName: 'Алексей Смирнов', email: 'a.smirnov@yandex.ru', phone: '+7 900 333-44-55', type: 'free' },
  { id: 4, fullName: 'Ольга Кузнецова', email: 'olga.k@mail.ru', phone: '+7 900 444-55-66', type: 'paid' },
  { id: 5, fullName: 'Дмитрий Волков', email: 'd.volkov@gmail.com', phone: '+7 900 555-66-77', type: 'vip' },
  { id: 6, fullName: 'Екатерина Новикова', email: 'e.novikova@yandex.ru', phone: '+7 900 666-77-88', type: 'free' }
]

const seed: Client[] = [...handAuthored, ...generateClients(24, 7)]

export function useClients() {
  const clients = useState<Client[]>('clients', () => structuredClone(seed))

  function getClient(id: number | null | undefined): Client | undefined {
    if (id == null) return undefined
    return clients.value.find((client) => client.id === id)
  }

  function updateClientType(id: number, type: Client['type']) {
    const client = getClient(id)
    if (client) client.type = type
  }

  return { clients, getClient, updateClientType }
}
