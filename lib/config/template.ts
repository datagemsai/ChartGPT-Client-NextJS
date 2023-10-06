import { Config } from "@/lib/types"

export default <Config> {
  kvRestApiUrl: '',
  kvRestApiToken: '',
  allowedEmailDomains: ['cadlabs.org'],
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
