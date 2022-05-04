import { SampleMarketStatusEnum } from '../../enums/SampleMarketStatusEnum'
import { ISampleMarketSchema } from '../../schemas/ISampleMarketSchema'



// TODO: Review fixtures
export const SAMPLE_RAW_MARKETS: ISampleMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: SampleMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: SampleMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: SampleMarketStatusEnum.OFFLINE,
  },
]

