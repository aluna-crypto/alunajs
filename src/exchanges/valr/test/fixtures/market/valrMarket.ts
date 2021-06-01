import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IMarketWithCurrency } from '../../../modules/ValrMarketModule'
import { IValrMarketSchema } from '../../../schemas/IValrMarketSchema'



export const VALR_FETCH_MARKETS_RESPONSE: IValrMarketSchema[] = [
  {
    currencyPair: 'USDCETH',
    askPrice: '0.00039334',
    bidPrice: '0.00039291',
    lastTradedPrice: '0.00039266',
    previousClosePrice: '0.00041848',
    baseVolume: '0',
    highPrice: '0.00043926',
    lowPrice: '0.00038734',
    created: '2021-05-31T13:53:07.930Z',
    changeFromPrevious: '-6.16',
  },
  {
    currencyPair: 'BTCZAR',
    askPrice: '528862',
    bidPrice: '528027',
    lastTradedPrice: '528422',
    previousClosePrice: '513184',
    baseVolume: '262.38179134',
    highPrice: '533499',
    lowPrice: '490999',
    created: '2021-05-31T13:53:10.645Z',
    changeFromPrevious: '2.96',
  },
  {
    currencyPair: 'ETHZAR',
    askPrice: '36350',
    bidPrice: '36306',
    lastTradedPrice: '36349',
    previousClosePrice: '34524',
    baseVolume: '675.16130937',
    highPrice: '36973',
    lowPrice: '32890',
    created: '2021-05-31T13:53:03.155Z',
    changeFromPrevious: '5.28',
  },
]



export const VALR_MARKETS_WITH_CURRENCY: IMarketWithCurrency[] = [
  {
    currencyPair: 'USDCETH',
    askPrice: '0.00039334',
    bidPrice: '0.00039291',
    lastTradedPrice: '0.00039266',
    previousClosePrice: '0.00041848',
    baseVolume: '0',
    highPrice: '0.00043926',
    lowPrice: '0.00038734',
    created: '2021-05-31T13:53:07.930Z',
    changeFromPrevious: '-6.16',
    baseCurrency: 'USDC',
    quoteCurrency: 'ETH',
  },
  {
    currencyPair: 'BTCZAR',
    askPrice: '528862',
    bidPrice: '528027',
    lastTradedPrice: '528422',
    previousClosePrice: '513184',
    baseVolume: '262.38179134',
    highPrice: '533499',
    lowPrice: '490999',
    created: '2021-05-31T13:53:10.645Z',
    changeFromPrevious: '2.96',
    baseCurrency: 'BTC',
    quoteCurrency: 'ZAR',
  },
  {
    currencyPair: 'ETHZAR',
    askPrice: '36350',
    bidPrice: '36306',
    lastTradedPrice: '36349',
    previousClosePrice: '34524',
    baseVolume: '675.16130937',
    highPrice: '36973',
    lowPrice: '32890',
    created: '2021-05-31T13:53:03.155Z',
    changeFromPrevious: '5.28',
    baseCurrency: 'ETH',
    quoteCurrency: 'ZAR',
  },
]



export const VALR_PARSED_MARKETS: IAlunaMarketSchema[] = [
  {
    pairSymbol: 'USDCETH',
    baseSymbol: 'USDC',
    quoteSymbol: 'ETH',
    ticker: {
      high: 0.00043926,
      low: 0.00038734,
      bid: 0.00039291,
      ask: 0.00039334,
      last: 0.00039266,
      date: new Date('2021-05-31T03:00:00.000Z'),
      change: -0.0616,
      baseVolume: 0,
      quoteVolume: 0,
    },
    spotEnabled: false,
    marginEnabled: false,
    derivativesEnabled: false,
  },
  {
    pairSymbol: 'BTCZAR',
    baseSymbol: 'BTC',
    quoteSymbol: 'ZAR',
    ticker: {
      high: 533499,
      low: 490999,
      bid: 528027,
      ask: 528862,
      last: 528422,
      date: new Date('2021-05-31T03:00:00.000Z'),
      change: 0.0296,
      baseVolume: 262.38179134,
      quoteVolume: 0,
    },
    spotEnabled: false,
    marginEnabled: false,
    derivativesEnabled: false,
  },
  {
    pairSymbol: 'ETHZAR',
    baseSymbol: 'ETH',
    quoteSymbol: 'ZAR',
    ticker: {
      high: 36973,
      low: 32890,
      bid: 36306,
      ask: 36350,
      last: 36349,
      date: new Date('2021-05-31T03:00:00.000Z'),
      change: 0.0528,
      baseVolume: 675.16130937,
      quoteVolume: 0,
    },
    spotEnabled: false,
    marginEnabled: false,
    derivativesEnabled: false,
  },
]
