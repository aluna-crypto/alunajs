import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { BittrexMarketStatusEnum } from '../../enums/BittrexMarketStatusEnum'
import {
  IBittrexMarketInfoSchema,
  IBittrexMarketSchema,
  IBittrexMarketsSchema,
  IBittrexMarketSummarySchema,
  IBittrexMarketTickerSchema,
} from '../../schemas/IBittrexMarketSchema'



export const BITTREX_RAW_MARKET_SUMMARIES: IBittrexMarketSummarySchema[] = [
  {
    symbol: 'BTC-EUR',
    high: '33296.36600000',
    low: '31790.00000000',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    percentChange: '3.07',
    updatedAt: '2022-02-04T10:30:13.713Z',
  },
  {
    symbol: 'BTC-USD',
    high: '38221.84800000',
    low: '36269.71700000',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    percentChange: '4.10',
    updatedAt: '2022-02-04T10:30:18.73Z',
  },
  {
    symbol: 'BTC-USDT',
    high: '38200.00000000',
    low: '36265.18000000',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    percentChange: '4.20',
    updatedAt: '2022-02-04T10:30:18.73Z',
  },
  {
    symbol: 'ETH-BTC',
    high: '5.22800000',
    low: '6.92700000',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    percentChange: '2.10',
    updatedAt: '2022-02-04T10:30:18.73Z',
  },
]

export const BITTREX_RAW_MARKET_TICKERS: IBittrexMarketTickerSchema[] = [
  {
    symbol: 'BTC-EUR',
    lastTradeRate: '33296.36600000',
    bidRate: '32999.75800000',
    askRate: '33048.12000000',
  },
  {
    symbol: 'BTC-USD',
    lastTradeRate: '37865.49400000',
    bidRate: '37836.19000000',
    askRate: '37850.13900000',
  },
  {
    symbol: 'BTC-USDT',
    lastTradeRate: '37853.24990000',
    bidRate: '37819.37640000',
    askRate: '37841.13653987',
  }]

export const BITTREX_RAW_MARKETS_INFO: IBittrexMarketInfoSchema[] = [
  {
    symbol: 'BTC-EUR',
    baseCurrencySymbol: 'BTC',
    quoteCurrencySymbol: 'EUR',
    minTradeSize: 0.00044994,
    precision: 3,
    status: BittrexMarketStatusEnum.ONLINE,
    createdAt: '2020-03-30T06:12:04.86Z',
    prohibitedIn: ['US'],
    associatedTermsOfService: [],
    tags: [],
    notice: '',
  },
  {
    symbol: 'BTC-USD',
    baseCurrencySymbol: 'BTC',
    quoteCurrencySymbol: 'USD',
    precision: 3,
    minTradeSize: 0.00006230,
    status: BittrexMarketStatusEnum.ONLINE,
    createdAt: '2018-05-31T13:24:40.77Z',
    prohibitedIn: [],
    associatedTermsOfService: [],
    tags: [],
    notice: '',
  },
  {
    symbol: 'BTC-USDT',
    baseCurrencySymbol: 'BTC',
    quoteCurrencySymbol: 'USDT',
    minTradeSize: 0.00006230,
    precision: 8,
    status: BittrexMarketStatusEnum.OFFLINE,
    createdAt: '2015-12-11T06:31:40.633Z',
    prohibitedIn: [],
    associatedTermsOfService: [],
    tags: [],
    notice: '',
  },
]

export const BITTREX_RAW_MARKET: IBittrexMarketSchema = {
  marketInfo: BITTREX_RAW_MARKETS_INFO[0],
  summary: BITTREX_RAW_MARKET_SUMMARIES[0],
  ticker: BITTREX_RAW_MARKET_TICKERS[0],
}

export const BITTREX_RAW_MARKETS: IBittrexMarketsSchema = {
  marketsInfo: BITTREX_RAW_MARKETS_INFO,
  summaries: BITTREX_RAW_MARKET_SUMMARIES,
  tickers: BITTREX_RAW_MARKET_TICKERS,
}

export const BITTREX_PARSED_MARKETS: IAlunaMarketSchema[] = [
  {
    exchangeId: 'bittrex',
    symbolPair: 'BTC-EUR',
    baseSymbolId: 'BTC',
    quoteSymbolId: 'EUR',
    ticker: {
      high: 33296.366,
      low: 31790,
      bid: 32999.758,
      ask: 33048.12,
      last: 33296.366,
      date: new Date('2022-02-04T12:32:38.582Z'),
      change: 0.030699999999999998,
      baseVolume: 9.64127008,
      quoteVolume: 311825.04145095,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
  {
    exchangeId: 'bittrex',
    symbolPair: 'BTC-USD',
    baseSymbolId: 'BTC',
    quoteSymbolId: 'USD',
    ticker: {
      high: 38221.848,
      low: 36269.717,
      bid: 37836.19,
      ask: 37850.139,
      last: 37865.494,
      date: new Date('2022-02-04T12:32:38.582Z'),
      change: 0.040999999999999995,
      baseVolume: 126.19108264,
      quoteVolume: 4696409.2164974,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
  {
    exchangeId: 'bittrex',
    symbolPair: 'BTC-USDT',
    baseSymbolId: 'BTC',
    quoteSymbolId: 'USDT',
    ticker: {
      high: 38200,
      low: 36265.18,
      bid: 37819.3764,
      ask: 37841.13653987,
      last: 37853.2499,
      date: new Date('2022-02-04T12:32:38.582Z'),
      change: 0.042,
      baseVolume: 86.3244965,
      quoteVolume: 3191538.22788546,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
]
