import { FtxMarketStatusEnum } from '../../enums/FtxMarketStatusEnum'
import { IFtxMarketSchema } from '../../schemas/IFtxMarketSchema'



// TODO: Review fixtures
export const FTX_RAW_MARKETS: IFtxMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: FtxMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: FtxMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: FtxMarketStatusEnum.OFFLINE,
  },
]

