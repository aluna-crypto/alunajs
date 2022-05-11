import { BinanceOrderTypeEnum } from '../../enums/BinanceOrderTypeEnum'
import { IBinanceOrderSchema } from '../../schemas/IBinanceOrderSchema'



// TODO: Review fixtures
export const BINANCE_RAW_ORDERS: IBinanceOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbol: 'BTC/USD',
    type: BinanceOrderTypeEnum.LIMIT,
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbol: 'ETH/USD',
    type: BinanceOrderTypeEnum.MARKET,
  },
]
