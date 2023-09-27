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
    chatBotDescription: 'Discover insights with conversational analytics',
    dataSources: {
      'bigquery/chartgpt-staging/metaquants_nft_finance_aggregator/p2p_and_p2pool_loan_data_borrow': {
        dataSourceName: 'MetaQuants NFT Finance Aggregator',
        dataSourceDescription: `
        Leverage the MetaQuants NFT Finance Aggregator dataset to gain valuable insights into NFT loan history,
        outstanding loan indicators, and activity on both P2Peer and P2Pool protocols.
        The dataset currently includes a range of leading protocols, including X2Y2, Pine, BendDAO, ***REMOVED***, Arcade, and JPEGD.
        `,
        dataSourceURL: 'bigquery/chartgpt-staging/metaquants_nft_finance_aggregator/p2p_and_p2pool_loan_data_borrow',
        dataProviderName: 'MetaQuants',
        dataProviderWebsite: 'https://metaquants.xyz',
        dataProviderImage: '/data_providers/metaquants.png',
        sampleQuestions: [
          'What data is available?',
          'Perform exploratory data analysis.',
          'Plot the average APR for the ***REMOVED*** protocol in the past 6 months.',
          'Plot a bar chart of the USD lending volume for all protocols.',
          'Plot a stacked area chart of the USD lending volume for all protocols.',
        ]
      },
      'bigquery/chartgpt-staging/bitscrunch_unleash_nfts/nft_market_trends': {
        dataSourceName: 'bitsCrunch Unleash NFTs',
        dataSourceDescription: 'Explore NFT market trends over the past 3 months from the bitsCrunch Unleash NFTs data source.',
        dataSourceURL: 'bigquery/chartgpt-staging/bitscrunch_unleash_nfts/nft_market_trends',
        dataProviderName: 'bitsCrunch',
        dataProviderWebsite: 'https://docs.unleashnfts.com',
        dataProviderImage: '/data_providers/bitscrunch.png',
        sampleQuestions: [
          'What data is available?',
          'Perform exploratory data analysis.',
          'Plot all the metrics over the last 30 days',
        ]
      },
      'bigquery/chartgpt-staging/crypto_ethereum/transactions_sample': {
        dataSourceName: 'Ethereum Blockchain Transactions',
        dataSourceDescription: `
        Explore Ethereum blockchain transaction sample data.

        This dataset is part of a larger effort to make cryptocurrency data available in BigQuery
        through the Google Cloud Public Datasets program.
        `,
        dataSourceURL: 'bigquery/chartgpt-staging/crypto_ethereum/transactions_sample',
        dataProviderName: 'Google Cloud Public Datasets program',
        dataProviderWebsite: 'https://console.cloud.google.com/marketplace/product/ethereum/crypto-ethereum-blockchain',
        dataProviderImage: '', // '/data_providers/ethereum.png'
        sampleQuestions: [
          'What data is available?',
          'Perform exploratory data analysis.',
          'Plot the number of transactions over time.',
        ]
      },
      'bigquery/chartgpt-staging/crypto_ethereum/contracts': {
        dataSourceName: 'Ethereum Blockchain Contracts',
        dataSourceDescription: `
        Explore Ethereum blockchain contract data.

        This dataset is part of a larger effort to make cryptocurrency data available in BigQuery
        through the Google Cloud Public Datasets program.
        `,
        dataSourceURL: 'bigquery/chartgpt-staging/crypto_ethereum/contracts',
        dataProviderName: 'Google Cloud Public Datasets program',
        dataProviderWebsite: 'https://console.cloud.google.com/marketplace/product/ethereum/crypto-ethereum-blockchain',
        dataProviderImage: '', // '/data_providers/ethereum.png'
        sampleQuestions: [
          'What data is available?',
          'Perform exploratory data analysis.',
          'Plot the number of ERC20 and ERC721 contracts over time.',
        ]
      },
    },
  },
};
