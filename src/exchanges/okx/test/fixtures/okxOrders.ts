import { OkxOrderTypeEnum } from '../../enums/OkxOrderTypeEnum'
import { IOkxOrderSchema } from '../../schemas/IOkxOrderSchema'



// TODO: Review fixtures
export const OKX_RAW_ORDERS: IOkxOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbol: 'BTC/USD',
    type: OkxOrderTypeEnum.LIMIT,
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbol: 'ETH/USD',
    type: OkxOrderTypeEnum.MARKET,
  },
]
