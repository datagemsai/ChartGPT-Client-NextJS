import { Config } from "@/lib/types"

export default <Config> {
  allowedEmailDomains: ['metaquants.xyz', '***REMOVED***'],
  adminEmailDomains: ['***REMOVED***'],
  headerLogo: '/data_providers/metaquants.png',
  assistantLogo: '/data_providers/metaquants.png',
  chatBotName: 'MetaQuants Chat',
  chatBotWelcomeMessage: 'Welcome to MetaQuants Chat!',
  chatBotDescription: 'Discover insights with data-driven conversations',
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
  }
}
