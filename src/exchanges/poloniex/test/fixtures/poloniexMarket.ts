import {
  IPoloniexMarketResponseSchema,
  IPoloniexMarketSchema,
  IPoloniexTickerSchema,
} from '../../schemas/IPoloniexMarketSchema'



export const POLONIEX_RAW_BALANCES_RESPONSE: IPoloniexTickerSchema[] = [
  {
    id: 50,
    last: '0.00289979',
    lowestAsk: '0.00290072',
    highestBid: '0.00289886',
    percentChange: '-0.01731347',
    baseVolume: '34.57662119',
    quoteVolume: '11905.74320223',
    isFrozen: '0',
    postOnly: '0',
    marginTradingEnabled: '1',
    high24hr: '0.00295473',
    low24hr: '0.00287440',
  },
  {
    id: 148,
    last: '0.07092277',
    lowestAsk: '0.07094162',
    highestBid: '0.07093593',
    percentChange: '-0.00100107',
    baseVolume: '181.41410372',
    quoteVolume: '2549.32931801',
    isFrozen: '0',
    postOnly: '0',
    marginTradingEnabled: '1',
    high24hr: '0.07190323',
    low24hr: '0.06998660',
  },
  {
    id: 733,
    last: '0.00002461',
    lowestAsk: '0.00002478',
    highestBid: '0.00002471',
    percentChange: '-0.01243980',
    baseVolume: '0.08452872',
    quoteVolume: '3418.95083220',
    isFrozen: '0',
    postOnly: '0',
    marginTradingEnabled: '0',
    high24hr: '0.00002482',
    low24hr: '0.00002457',
  },
]

export const POLONIEX_RAW_MARKETS_RESPONSE: IPoloniexMarketResponseSchema = {
  BTC_LTC: POLONIEX_RAW_BALANCES_RESPONSE[0],
  BTC_ETH: POLONIEX_RAW_BALANCES_RESPONSE[1],
  BTC_ADA: POLONIEX_RAW_BALANCES_RESPONSE[2],
}


export const POLONIEX_RAW_MARKETS: IPoloniexMarketSchema[] = [
  {
    baseCurrency: 'LTC',
    quoteCurrency: 'BTC',
    currencyPair: 'BTC_LTC',
    ...POLONIEX_RAW_BALANCES_RESPONSE[0],
  },
  {
    baseCurrency: 'ETH',
    quoteCurrency: 'BTC',
    currencyPair: 'BTC_ETH',
    ...POLONIEX_RAW_BALANCES_RESPONSE[1],
  },
  {
    baseCurrency: 'ADA',
    quoteCurrency: 'BTC',
    currencyPair: 'BTC_ADA',
    ...POLONIEX_RAW_BALANCES_RESPONSE[2],
  },
]

