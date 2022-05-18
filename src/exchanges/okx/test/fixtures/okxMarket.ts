import { OkxMarketStatusEnum } from '../../enums/OkxMarketStatusEnum'
import { IOkxMarketSchema } from '../../schemas/IOkxMarketSchema'



// TODO: Review fixtures
export const OKX_RAW_MARKETS: IOkxMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: OkxMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: OkxMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: OkxMarketStatusEnum.OFFLINE,
  },
]

