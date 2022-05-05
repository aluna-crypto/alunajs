import { ValrOrderTypeEnum } from '../../enums/ValrOrderTypeEnum'
import { IValrOrderSchema } from '../../schemas/IValrOrderSchema'



// TODO: Review fixtures
export const VALR_RAW_ORDERS: IValrOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    type: ValrOrderTypeEnum.LIMIT,
    quantity: '9.94497801',
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    type: ValrOrderTypeEnum.MARKET,
    quantity: '9.94497801',
  },
]

