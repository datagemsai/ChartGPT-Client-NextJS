import { Config } from "@/lib/types"

export default <Config> {
  kvRestApiUrl: '',
  kvRestApiToken: '',
  allowedEmailDomains: ['***REMOVED***'],
  allowedEmailAddresses: [],
  adminEmailDomains: ['***REMOVED***'],
  adminEmailAddresses: [],
  headerLogo: '',
  assistantLogo: '',
  chatBotName: 'X Chat',
  chatBotWelcomeMessage: 'Welcome to X Chat!',
  chatBotDescription: 'An AI-powered chatbot',
  dataSources: {
    '': {
      dataSourceName: '',
      dataSourceDescription: `
      `,
      dataSourceURL: '',
      dataProviderName: '',
      dataProviderWebsite: '',
      dataProviderImage: '',
      sampleQuestions: [
        'What data is available?',
      ]
    },
  }
}
