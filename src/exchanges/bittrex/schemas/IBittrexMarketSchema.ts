export interface IBittrexMarketSchema {
    symbol: string
    baseCurrencySymbol: string
    quoteCurrencySymbol: string
    minTradeSize: string
    precision: number
    status: string
    createdAt: string
    prohibitedIn: string[]
    associatedTermsOfService: string[]
    tags: string[]
}

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

export interface IBittrexMarketWithTicker extends IBittrexMarketSchema {
    high: string
    low: string
    volume: string
    quoteVolume: string
    percentChange: string
    lastTradeRate: string
    bidRate: string
    askRate: string
}
