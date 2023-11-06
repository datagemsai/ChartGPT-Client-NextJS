import { Config } from "@/lib/types"

export default <Config> {
  kvRestApiUrl: 'https://helped-anteater-31080.kv.vercel-storage.com',
  kvRestApiToken: 'AXloASQgOGE0M2YxY2EtMTY3MS00MjY2LWFlNjEtYzc3ODc1MTUzNTJmYzg4YTU0M2IzY2NiNDE3NGI1ZTY2MDNiM2MwOTkxMzE=',
  allowedEmailDomains: [
    'ddproperty.com',
    'iproperty.com.my',
    'propertyguru.com.sg',
    'propertyguru.tech',
    'cadlabs.org',
  ],
  allowedEmailAddresses: [
    'mrsharadgupta@gmail.com',
    'jeziel.jones@gmail.com',
    // PropertyGuru
    'arnab@ddproperty.com',
    'jienmin.soh@iproperty.com.my',
    'soojin@propertyguru.com.sg',
    'suvro@propertyguru.tech',
  ],
  adminEmailDomains: ['cadlabs.org'],
  headerLogo: '/property_guru/property_guru_horizontal.svg',
  assistantLogo: '/property_guru/property_guru.svg',
  chatBotName: 'PropertyGuru Chat',
  chatBotWelcomeMessage: 'Welcome to PropertyGuru Chat!',
  chatBotDescription: 'An AI-powered chatbot',
  dataSources: {
    // 'bigquery/chartgpt-staging/real_estate/usa_real_estate_listings': {
    //   dataSourceName: 'USA Real Estate Listings',
    //   dataSourceDescription: `
    //   Explore USA real estate listings data with the following features:
    //   status, bed, bath, acre_lot, city, state, zip_code, house_size, prev_sold_date, price.
    //   `,
    //   dataSourceURL: 'bigquery/chartgpt-staging/real_estate/usa_real_estate_listings',
    //   dataProviderName: 'PropertyGuru',
    //   dataProviderWebsite: 'https://www.propertyguru.com.sg/',
    //   dataProviderImage: '/property_guru/property_guru.svg',
    //   sampleQuestions: [
    //     'What data is available?',
    //     'What is the average price of a 3 bedroom condo in Singapore?',
    //     'Create a chart of the average price of a 3 bedroom condo in Singapore over the past 5 years.',
    //     'How many 3 bedroom condos are there for sale in Singapore?',
    //   ]
    // },
    'bigquery/chartgpt-staging/real_estate/usa_real_estate_listings_synthetic': {
      dataSourceName: 'USA Real Estate Listings with Synthetic Data',
      dataSourceDescription: `
      Explore USA real estate listings data with the following features:
      status, bed, bath, acre_lot, city, state, zip_code, house_size, prev_sold_date, price,
      and also including synthetic data for the following features:
      web_visits, physical viewings, furnished, views_last_3_days, feedback, and sale_duration.
      `,
      dataSourceURL: 'bigquery/chartgpt-staging/real_estate/usa_real_estate_listings_synthetic',
      dataProviderName: 'PropertyGuru',
      dataProviderWebsite: 'https://www.propertyguru.com.sg/',
      dataProviderImage: '/property_guru/property_guru.svg',
      sampleQuestions: [
        'What data is available?',
        'What is the average sale duration of furnished vs. unfurnished properties over time?',
        'Which states offer the best value for money in terms of house size? Show this on a map.',
        'What is the most common feedback term for houses in New York?',
        'Which cities had the highest USD sale volume in 2022?',
        'For properties that have had more than 10 viewings, how long, on average, does it take to sell them?',
        'What percentage of website visits for properties with 3 bedrooms and above convert into actual property viewings?',
        'What combination of bedrooms and bathrooms had the highest average web visits in October 2022 in Los Angeles?',
        // 'Based on the number of bedrooms and the zip code, what is the average selling price of similar properties in the past 6 months?',
        // 'For properties listed on our website, how does the number of website visits correlate with the number of physical property viewings?',
        // 'Which properties have had more than 50% of their total viewings in the past 3 days, indicating a recent surge in interest?',
        // 'Do properties with furnishings typically have a higher number of viewings or faster sales compared to unfurnished properties?',
        // 'Based on zip code and the number of bedrooms, what is the best day of the week to list a property to maximize website visits?',
        // 'What percentage of website visits for a property convert into actual physical viewings? How does this vary by zip code or number of bedrooms?',
        // 'In which zip codes do we have an oversupply or undersupply of properties with a specific number of bedrooms?',
        // 'For properties that have had more than 10 viewings, how long, on average, does it take to sell them? Does this duration change when considering the number of bedrooms or furnishing status?',
        // 'For properties with feedback from viewings, what common characteristics or features are frequently mentioned as positives or negatives, and how do these feedback points correlate with the number of bedrooms or furnishings?',
        // 'Are there specific months or seasons where properties in certain zip codes or with a certain number of bedrooms are viewed or sold more frequently?',
      ]
    },
  }
}
