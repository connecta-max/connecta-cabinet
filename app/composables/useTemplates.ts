import type { ResponseTemplate } from '~/types'

const seed: ResponseTemplate[] = [
  { id: 1, name: 'Приветствие', content: 'Здравствуйте! Меня зовут {имя}, я помогу вам с этим вопросом.' },
  { id: 2, name: 'Просьба подождать', content: 'Спасибо за обращение! Уточняю информацию, отвечу в течение нескольких минут.' },
  { id: 3, name: 'Запрос данных', content: 'Подскажите, пожалуйста, номер заказа или email, указанный при регистрации.' },
  { id: 4, name: 'Закрытие обращения', content: 'Рады были помочь! Если вопрос повторится — пишите, мы всегда на связи.' }
]

let nextId = seed.length + 1

export function useTemplates() {
  const templates = useState<ResponseTemplate[]>('templates', () => structuredClone(seed))

  function addTemplate(data: { name: string; content: string }) {
    templates.value.push({ id: nextId++, ...data })
  }

  function updateTemplate(id: number, data: { name: string; content: string }) {
    const template = templates.value.find((item) => item.id === id)
    if (template) Object.assign(template, data)
  }

  function removeTemplate(id: number) {
    templates.value = templates.value.filter((item) => item.id !== id)
  }

  return { templates, addTemplate, updateTemplate, removeTemplate }
}
