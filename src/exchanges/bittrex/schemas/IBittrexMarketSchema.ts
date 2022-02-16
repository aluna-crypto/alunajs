export interface IBittrexMarketSummarySchema {
    symbol: string
    high: string
    low: string
    volume: string
    quoteVolume: string
    percentChange: string
    updatedAt: string
}

export interface IBittrexMarketTickerSchema {
    symbol: string
    lastTradeRate: string
    bidRate: string
    askRate: string
}

export interface IBittrexMarketWithTicker extends IBittrexMarketTickerSchema {
    baseCurrencySymbol: string
    quoteCurrencySymbol: string
    high: string
    low: string
    volume: string
    quoteVolume: string
    percentChange: string
}
