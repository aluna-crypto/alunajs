import { BitfinexOrderTypeEnum } from '../../enums/BitfinexOrderTypeEnum'
import { IBitfinexOrderSchema } from '../../schemas/IBitfinexOrderSchema'



// TODO: Review fixtures
export const BITFINEX_RAW_ORDERS: IBitfinexOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    type: BitfinexOrderTypeEnum.LIMIT,
    quantity: '9.94497801',
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    type: BitfinexOrderTypeEnum.MARKET,
    quantity: '9.94497801',
  },
]

