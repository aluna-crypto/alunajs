import { BitfinexMarketStatusEnum } from '../../enums/BitfinexMarketStatusEnum'
import { IBitfinexMarketSchema } from '../../schemas/IBitfinexMarketSchema'



// TODO: Review fixtures
export const BITFINEX_RAW_MARKETS: IBitfinexMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: BitfinexMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: BitfinexMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: BitfinexMarketStatusEnum.OFFLINE,
  },
]

