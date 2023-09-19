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
  publicRuntimeConfig: {
    // Will be available on both server and client
    // const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
    headerLogo: '/chartgpt/logo_chartgpt_horizontal.png',
    assistantLogo: '/chartgpt/icon_chartgpt.png',
    chatBotName: 'ChartGPT',
    chatBotWelcomeMessage: 'Welcome to ChartGPT!',
    chatBotDescription: 'Discover Insights with Conversational Analytics',
    chatBotExampleMessages: [
      {
        heading: 'Plot the average APR for the NFTfi protocol in the past 6 months.',
        message: 'Plot the average APR for the NFTfi protocol in the past 6 months.',
      },
      {
        heading: 'Plot a bar chart of the USD lending volume for all protocols.',
        message: 'Plot a bar chart of the USD lending volume for all protocols.',
      },
      {
        heading: 'Plot a stacked area chart of the USD lending volume for all protocols.',
        message: 'Plot a stacked area chart of the USD lending volume for all protocols.',
      }
    ]
  },
};
