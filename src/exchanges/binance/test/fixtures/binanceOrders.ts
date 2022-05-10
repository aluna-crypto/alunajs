import { binanceOrderTypeEnum } from '../../enums/binanceOrderTypeEnum'
import { IbinanceOrderSchema } from '../../schemas/IbinanceOrderSchema'



// TODO: Review fixtures
export const BINANCE_RAW_ORDERS: IbinanceOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbol: 'BTC/USD',
    type: binanceOrderTypeEnum.LIMIT,
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbol: 'ETH/USD',
    type: binanceOrderTypeEnum.MARKET,
  },
]
