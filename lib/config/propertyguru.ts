import { Config } from "@/lib/types"

export default <Config> {
  kvRestApiUrl: '***REMOVED***',
  kvRestApiToken: '***REMOVED***',
  allowedEmailDomains: ['***REMOVED***', '***REMOVED***'],
  headerLogo: '/property_guru/property_guru_horizontal.svg',
  assistantLogo: '/property_guru/property_guru.svg',
  chatBotName: 'PropertyGuru Chat',
  chatBotWelcomeMessage: 'Welcome to PropertyGuru Chat!',
  chatBotDescription: 'An AI-powered chatbot',
  dataSources: {
    'bigquery/chartgpt-staging/real_estate/usa_real_estate_listings': {
      dataSourceName: 'USA Real Estate Listings',
      dataSourceDescription: `
      Explore USA real estate listings data with the following features:
      status, bed, bath, acre_lot, city, state, zip_code, house_size, prev_sold_date, price.
      `,
      dataSourceURL: 'bigquery/chartgpt-staging/real_estate/usa_real_estate_listings',
      dataProviderName: 'PropertyGuru',
      dataProviderWebsite: 'https://www.***REMOVED***/',
      dataProviderImage: '/property_guru/property_guru.svg',
      sampleQuestions: [
        'What is the average price of a 3 bedroom condo in Singapore?',
        'Create a chart of the average price of a 3 bedroom condo in Singapore over the past 5 years.',
        'How many 3 bedroom condos are there for sale in Singapore?',
      ]
    }
  }
}
