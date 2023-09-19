/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  serverRuntimeConfig: {
    example: '',
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
    headerLogo: '/property_guru_horizontal.svg',
    assistantLogo: '/property_guru.svg',
    chatBotName: 'PropertyGuru Chat',
    chatBotDescription: 'An AI-powered chatbot',
    chatBotExampleMessages: [
      {
        heading: 'What is the average price of a 3 bedroom condo in Singapore?',
        message: 'What is the average price of a 3 bedroom condo in Singapore?',
      },
      {
        heading: 'Create a chart of the average price of a 3 bedroom condo in Singapore over the past 5 years.',
        message: 'Create a chart of the average price of a 3 bedroom condo in Singapore over the past 5 years.',
      },
      {
        heading: 'How many 3 bedroom condos are there for sale in Singapore?',
        message: 'How many 3 bedroom condos are there for sale in Singapore?',
      }
    ]
  },
};
