import { BinanceMarketStatusEnum } from '../../enums/BinanceMarketStatusEnum'
import { IBinanceMarketSchema } from '../../schemas/IBinanceMarketSchema'



// TODO: Review fixtures
export const BINANCE_RAW_MARKETS: IBinanceMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: BinanceMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: BinanceMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: BinanceMarketStatusEnum.OFFLINE,
  },
]

