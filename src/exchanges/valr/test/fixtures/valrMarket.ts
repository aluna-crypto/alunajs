import { ValrMarketStatusEnum } from '../../enums/ValrMarketStatusEnum'
import { IValrMarketSchema } from '../../schemas/IValrMarketSchema'



// TODO: Review fixtures
export const VALR_RAW_MARKETS: IValrMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: ValrMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: ValrMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: ValrMarketStatusEnum.OFFLINE,
  },
]

