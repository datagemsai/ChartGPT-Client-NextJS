import { Config } from "@/lib/types"

export default <Config> {
  kvRestApiUrl: '***REMOVED***',
  kvRestApiToken: '***REMOVED***',
  allowedEmailDomains: ['***REMOVED***', '***REMOVED***'],
  adminEmailDomains: ['***REMOVED***'],
  headerLogo: '/use_cases/aviation.svg',
  assistantLogo: '/use_cases/aviation.svg',
  chatBotName: 'Airport Chat',
  chatBotWelcomeMessage: 'Welcome to Airport Chat!',
  chatBotDescription: 'Discover insights with data-driven conversations',
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
        'Plot average Taxi times (before and after) for each gate',
        'Plot the passenger arrivals by terminal over time',
        'Given 2022 seasonal fluctuations, what volume of baggage can we anticipate between December 15th and December 31st?',
        'Which gates had on average the largest volume of baggage in September?',
        'From our historical gate usage data, which gates are most frequently delayed in turning over for incoming flights during morning rush hours (6:30 am - 9:30 am)?',
        'Given 2022 seasonal fluctuations, what volume of baggage can we anticipate between December 15th and December 31st?',
      ]
    },
  }
}
