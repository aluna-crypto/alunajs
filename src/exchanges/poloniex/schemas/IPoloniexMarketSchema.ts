export interface IPoloniexTickerSchema {
    id: number
    last: string
    lowestAsk: string
    highestBid: string
    percentChange: string
    baseVolume: string
    quoteVolume: string
    isFrozen: string
    postOnly: string
    marginTradingEnabled: string
    high24hr: string
    low24hr: string
}

export interface IPoloniexMarketSchema {
    [key: string]: IPoloniexTickerSchema
}

export interface IPoloniexMarketWithCurrency extends IPoloniexTickerSchema {
    baseCurrency: string
    quoteCurrency: string
    currencyPair: string
}
