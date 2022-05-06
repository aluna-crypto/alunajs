import { GateOrderTypeEnum } from '../enums/GateOrderTypeEnum'



// TODO: Describe order interface for Gate exchange
export interface IGateOrderSchema {
  id: string
  type: GateOrderTypeEnum
  quantity: string
  // ...
}
