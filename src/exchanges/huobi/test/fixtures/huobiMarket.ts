import { HuobiMarketStatusEnum } from '../../enums/HuobiMarketStatusEnum'
import { IHuobiMarketSchema } from '../../schemas/IHuobiMarketSchema'



// TODO: Review fixtures
export const HUOBI_RAW_MARKETS: IHuobiMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: HuobiMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: HuobiMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: HuobiMarketStatusEnum.OFFLINE,
  },
]

