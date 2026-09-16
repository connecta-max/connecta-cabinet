import type { SlaThresholds } from '~/types'

interface ChannelSettings {
  telegramToken: string
  telegramConnected: boolean
  widgetSnippet: string
}

interface CrmSettings {
  channels: ChannelSettings
  slaMinutes: SlaThresholds
  defaultPenaltyAmount: number
  autoPenaltyEnabled: boolean
  defaultTheme: 'light' | 'dark'
  defaultLocale: 'ru' | 'en'
}

function createDefaults(): CrmSettings {
  return {
    channels: {
      telegramToken: '',
      telegramConnected: false,
      widgetSnippet:
        '<script src="https://cdn.connecta.io/widget.js" data-connecta-widget data-bot-username="connecta_support_bot" async></script>'
    },
    slaMinutes: { vip: 5, paid: 15, free: 60 },
    defaultPenaltyAmount: 500,
    autoPenaltyEnabled: true,
    defaultTheme: 'dark',
    defaultLocale: 'ru'
  }
}

export function useSettings() {
  const settings = useState<CrmSettings>('crm-settings', createDefaults)

  function saveTelegramToken(token: string) {
    settings.value.channels.telegramToken = token
    settings.value.channels.telegramConnected = token.trim().length > 0
  }

  return { settings, saveTelegramToken }
}
