import { GateMarketStatusEnum } from '../../enums/GateMarketStatusEnum'
import { IGateMarketSchema } from '../../schemas/IGateMarketSchema'



// TODO: Review fixtures
export const GATE_RAW_MARKETS: IGateMarketSchema[] = [
  {
    symbol: 'BTC-EUR',
    volume: '9.64127008',
    quoteVolume: '311825.04145095',
    status: GateMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USD',
    volume: '126.19108264',
    quoteVolume: '4696409.21649740',
    status: GateMarketStatusEnum.ONLINE,
  },
  {
    symbol: 'BTC-USDT',
    volume: '86.32449650',
    quoteVolume: '3191538.22788546',
    status: GateMarketStatusEnum.OFFLINE,
  },
]

