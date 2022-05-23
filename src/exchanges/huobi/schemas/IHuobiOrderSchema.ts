import { HuobiOrderTypeEnum } from '../enums/HuobiOrderTypeEnum'



// TODO: Describe order interface for Huobi exchange
export interface IHuobiOrderSchema {
  id: string
  symbol: string
  type: HuobiOrderTypeEnum
  // ...
}
