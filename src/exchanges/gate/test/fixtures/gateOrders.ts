import { GateOrderTypeEnum } from '../../enums/GateOrderTypeEnum'
import { IGateOrderSchema } from '../../schemas/IGateOrderSchema'



// TODO: Review fixtures
export const GATE_RAW_ORDERS: IGateOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    type: GateOrderTypeEnum.LIMIT,
    quantity: '9.94497801',
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    type: GateOrderTypeEnum.MARKET,
    quantity: '9.94497801',
  },
]

