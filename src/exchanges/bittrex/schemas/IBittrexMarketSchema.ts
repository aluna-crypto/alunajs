export enum BittrexMarketStatusEnum {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE'
}

export interface IBittrexMarketSchema {
    symbol: string
    baseCurrencySymbol: string
    quoteCurrencySymbol: string
    minTradeSize: string
    precision: number
    status: BittrexMarketStatusEnum
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

export interface IBittrexMarketWithTicker extends IBittrexMarketTickerSchema {
    baseCurrencySymbol: string
    quoteCurrencySymbol: string
    high: string
    low: string
    volume: string
    quoteVolume: string
    percentChange: string
}
