import { PoloniexMarketStatusEnum } from '../../enums/PoloniexMarketStatusEnum'
import { IPoloniexMarketSchema } from '../../schemas/IPoloniexMarketSchema'



// TODO: Review fixtures
export const POLONIEX_RAW_MARKETS: IPoloniexMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: PoloniexMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: PoloniexMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: PoloniexMarketStatusEnum.OFFLINE,
  },
]

