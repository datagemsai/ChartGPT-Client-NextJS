import { type Message } from 'ai'
import { DataSource } from '@/lib/redux/data-slice'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date | string | number
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
  allowedEmailDomains?: string[],
  allowedEmailAddresses?: string[],
  adminEmailDomains?: string[],
  adminEmailAddresses?: string[],
  publicPaths?: string[],
  headerLogo: string,
  assistantLogo: string,
  chatBotName: string,
  chatBotWelcomeMessage: string,
  chatBotDescription: string,
  dataSources: {
    [key: string]: DataSource
  }
}

export interface User {
  id: string
  email?: string
  name?: string
  role: UserRole
  image?: string
  conversations?: string[]
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}
