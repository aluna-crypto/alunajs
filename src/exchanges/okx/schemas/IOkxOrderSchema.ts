import { OkxOrderTypeEnum } from '../enums/OkxOrderTypeEnum'



// TODO: Describe order interface for Okx exchange
export interface IOkxOrderSchema {
  id: string
  symbol: string
  type: OkxOrderTypeEnum
  // ...
}
