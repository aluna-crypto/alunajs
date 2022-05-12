import { PoloniexOrderTypeEnum } from '../../enums/PoloniexOrderTypeEnum'
import { IPoloniexOrderSchema } from '../../schemas/IPoloniexOrderSchema'



// TODO: Review fixtures
export const POLONIEX_RAW_ORDERS: IPoloniexOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbol: 'BTC/USD',
    type: PoloniexOrderTypeEnum.LIMIT,
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbol: 'ETH/USD',
    type: PoloniexOrderTypeEnum.MARKET,
  },
]
