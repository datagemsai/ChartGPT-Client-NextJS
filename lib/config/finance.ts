import { Config } from "@/lib/types"

export default <Config> {
  allowedEmailDomains: ['cadlabs.org'],
  headerLogo: '',
  assistantLogo: '',
  chatBotName: 'Finance Chat',
  chatBotWelcomeMessage: 'Welcome to Finance Chat!',
  chatBotDescription: 'Discover insights with data-driven conversations',
  dataSources: {
    'bigquery/chartgpt-staging/finance/private_equity': {
      dataSourceName: 'Private Equity',
      dataSourceDescription: ``,
      dataSourceURL: 'bigquery/chartgpt-staging/finance/private_equity',
      dataProviderName: '',
      dataProviderWebsite: '',
      dataProviderImage: '',
      sampleQuestions: [
        'Can you show me the month-over-month performance of Tech sector ETFs in my clients’ portfolios compared to the NASDAQ index over the past year?',
        'Given the recent hikes in interest rates, how have the bond holdings in my portfolios been impacted compared to benchmark Treasury yields?',
        'From our internal data, which asset class has consistently outperformed the S&P 500 for clients in the 45-55 age bracket over the last five years?',
        'Considering recent global macroeconomic shifts, how did emerging market equities in our portfolios perform relative to the MSCI Emerging Markets Index last quarter?',
        'Which clients had the highest exposure to the Energy sector during the last oil price crash, and how did their portfolios fare against the broader market?',
        'Using our internal transaction data, can we identify clients who have consistently adjusted their portfolio ahead of major market movements in the past two years?',
        'Given the projected GDP growth in Asian markets, how might the Asian-Pacific equities in our managed portfolios be impacted over the next six months?',
        'Analyzing the past five years, during which month do we typically see the highest volume of buy/sell transactions, and can we anticipate similar trends this year?',
        'How did the real estate investment trusts (REITs) in our portfolios perform during the last housing market fluctuation compared to the benchmark REIT index?',
        'Considering the ongoing trade discussions, how might the multinational corporations in our portfolios be affected, based on their historical sensitivity to such news?',
      ]
    },
  }
}
