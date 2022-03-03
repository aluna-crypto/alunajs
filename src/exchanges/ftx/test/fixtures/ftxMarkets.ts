import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { IFtxMarketSchema } from '../../schemas/IFtxMarketSchema'



export const FTX_RAW_MARKETS: IFtxMarketSchema[] = [
  {
    name: 'BNB/USD',
    enabled: true,
    postOnly: false,
    priceIncrement: 0.001,
    sizeIncrement: 0.01,
    minProvideSize: 0.01,
    last: 407.63,
    bid: 407.6,
    ask: 407.63,
    price: 407.63,
    type: 'spot',
    baseCurrency: 'BNB',
    quoteCurrency: 'USD',
    underlying: 'btc',
    restricted: false,
    highLeverageFeeExempt: true,
    change1h: 0.004462580608596443,
    change24h: -0.014722482059165477,
    changeBod: -0.002027136204946408,
    quoteVolume24h: 48865760.93654,
    volumeUsd24h: 48865760.93654,
  },
  {
    name: 'BTC/USD',
    enabled: true,
    postOnly: false,
    priceIncrement: 1,
    sizeIncrement: 0.0001,
    minProvideSize: 0.0001,
    last: 43401,
    bid: 43403,
    ask: 43404,
    price: 43403,
    type: 'spot',
    baseCurrency: 'BTC',
    quoteCurrency: 'USD',
    underlying: 'btc',
    restricted: false,
    highLeverageFeeExempt: true,
    change1h: 0.004768849688635785,
    change24h: -0.01947362475996837,
    changeBod: -0.009290116411778133,
    quoteVolume24h: 655827136.8962,
    volumeUsd24h: 655827136.8962,
  },
  {
    name: 'ETH/USD',
    enabled: true,
    postOnly: false,
    priceIncrement: 0.1,
    sizeIncrement: 0.001,
    minProvideSize: 0.001,
    last: 2911,
    bid: 2910.9,
    ask: 2911,
    price: 2911,
    type: 'spot',
    baseCurrency: 'ETH',
    quoteCurrency: 'USD',
    underlying: 'btc',
    restricted: false,
    highLeverageFeeExempt: true,
    change1h: 0.009677083694634247,
    change24h: -0.031700096464092074,
    changeBod: -0.009695526450076543,
    quoteVolume24h: 400900371.3091,
    volumeUsd24h: 400900371.3091,
  },
]

export const FTX_PARSED_MARKETS: IAlunaMarketSchema[] = [
  {
    exchangeId: 'ftx',
    symbolPair: 'BNB/USD',
    baseSymbolId: 'BNB',
    quoteSymbolId: 'USD',
    ticker: {
      high: 407.63,
      low: 407.63,
      bid: 407.6,
      ask: 407.63,
      last: 407.63,
      date: new Date('2022-03-03T11:18:45.844Z'),
      change: -0.014722482059165477,
      baseVolume: 48865760.93654,
      quoteVolume: 48865760.93654,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
  {
    exchangeId: 'ftx',
    symbolPair: 'BTC/USD',
    baseSymbolId: 'BTC',
    quoteSymbolId: 'USD',
    ticker: {
      high: 43403,
      low: 43403,
      bid: 43403,
      ask: 43404,
      last: 43401,
      date: new Date('2022-03-03T11:18:45.844Z'),
      change: -0.01947362475996837,
      baseVolume: 655827136.8962,
      quoteVolume: 655827136.8962,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
  {
    exchangeId: 'ftx',
    symbolPair: 'ETH/USD',
    baseSymbolId: 'ETH',
    quoteSymbolId: 'USD',
    ticker: {
      high: 2911,
      low: 2911,
      bid: 2910.9,
      ask: 2911,
      last: 2911,
      date: new Date('2022-03-03T11:18:45.844Z'),
      change: -0.031700096464092074,
      baseVolume: 400900371.3091,
      quoteVolume: 400900371.3091,
    },
    spotEnabled: true,
    marginEnabled: false,
    derivativesEnabled: false,
    leverageEnabled: false,
    meta: {},
  },
]
