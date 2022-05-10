import { binanceMarketStatusEnum } from '../../enums/binanceMarketStatusEnum'
import { IbinanceMarketSchema } from '../../schemas/IbinanceMarketSchema'



// TODO: Review fixtures
export const BINANCE_RAW_MARKETS: IbinanceMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: binanceMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: binanceMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: binanceMarketStatusEnum.OFFLINE,
  },
]

