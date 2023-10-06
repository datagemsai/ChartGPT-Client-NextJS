import { Config } from "@/lib/types"

export default <Config> {
  kvRestApiUrl: 'https://tough-ant-39893.kv.vercel-storage.com',
  kvRestApiToken: 'AZvVASQgOTcyYmZhODAtMDNhYS00NDQ5LTk2NjgtNjdiZjNiOWZkNmZkM2NjNTAzODY0NWZkNGJhNjk3ZmUxZGIyNGJiMzA1MTM=',
  allowedEmailDomains: ['cadlabs.org'],
  headerLogo: '/use_cases/aviation.svg',
  assistantLogo: '/use_cases/aviation.svg',
  chatBotName: 'Airport Chat',
  chatBotWelcomeMessage: 'Welcome to Airport Chat!',
  chatBotDescription: 'An AI-powered chatbot',
  dataSources: {
    'bigquery/chartgpt-staging/aviation/airport_operations': {
      dataSourceName: 'Airport Operations Data',
      dataSourceDescription: `
      `,
      dataSourceURL: 'bigquery/chartgpt-staging/aviation/airport_operations',
      dataProviderName: '',
      dataProviderWebsite: '',
      dataProviderImage: '',
      sampleQuestions: [
        'What data is available?',
      ]
    },
  }
}
