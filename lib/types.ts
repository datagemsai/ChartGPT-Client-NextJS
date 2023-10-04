import { type Message } from 'ai'
import { DataSource } from '@/lib/redux/data-slice'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
  dataSourceURL?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Config {
  kvRestApiUrl?: string,
  kvRestApiToken?: string,
  allowedEmailDomains: string[],
  headerLogo: string,
  assistantLogo: string,
  chatBotName: string,
  chatBotWelcomeMessage: string,
  chatBotDescription: string,
  dataSources: {
    [key: string]: DataSource
  }
}
