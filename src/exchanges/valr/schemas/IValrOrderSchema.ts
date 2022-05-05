import { ValrOrderTypeEnum } from '../enums/ValrOrderTypeEnum'



// TODO: Describe order interface for Valr exchange
export interface IValrOrderSchema {
  id: string
  type: ValrOrderTypeEnum
  quantity: string
  // ...
}
