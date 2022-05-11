import { BitmexMarketStatusEnum } from '../../enums/BitmexMarketStatusEnum'
import { IBitmexMarketSchema } from '../../schemas/IBitmexMarketSchema'



// TODO: Review fixtures
export const BITMEX_RAW_MARKETS: IBitmexMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: BitmexMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: BitmexMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: BitmexMarketStatusEnum.OFFLINE,
  },
]

