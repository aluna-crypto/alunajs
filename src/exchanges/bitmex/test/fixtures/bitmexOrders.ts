import { BitmexOrderTypeEnum } from '../../enums/BitmexOrderTypeEnum'
import { IBitmexOrderSchema } from '../../schemas/IBitmexOrderSchema'



// TODO: Review fixtures
export const BITMEX_RAW_ORDERS: IBitmexOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbol: 'BTC/USD',
    type: BitmexOrderTypeEnum.LIMIT,
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbol: 'ETH/USD',
    type: BitmexOrderTypeEnum.MARKET,
  },
]
