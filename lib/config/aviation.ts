import { Config } from "@/lib/types"

export default <Config> {
  kvRestApiUrl: 'https://tough-ant-39893.kv.vercel-storage.com',
  kvRestApiToken: 'AZvVASQgOTcyYmZhODAtMDNhYS00NDQ5LTk2NjgtNjdiZjNiOWZkNmZkM2NjNTAzODY0NWZkNGJhNjk3ZmUxZGIyNGJiMzA1MTM=',
  allowedEmailDomains: ['cadlabs.org', 'dubaiairports.ae'],
  headerLogo: '/use_cases/aviation.svg',
  assistantLogo: '/use_cases/aviation.svg',
  chatBotName: 'Airport Chat',
  chatBotWelcomeMessage: 'Welcome to Airport Chat!',
  chatBotDescription: 'Discover insights with data-driven conversations',
  dataSources: {
    'bigquery/chartgpt-staging/aviation/airport_operations': {
      dataSourceName: 'Airport Operations Data',
      dataSourceDescription: `
      The Airport Operations dataset provides insights into daily airport activities, encompassing aspects like
      passenger traffic, taxi time, gate turnovers, baggage handling efficiencies, and more.
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
        'Plot the amount of passengers checked-in versus boarded for each gate over the past month.',
      ]
    },
  }
}
