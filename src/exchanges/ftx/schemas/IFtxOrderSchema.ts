import { FtxOrderTypeEnum } from '../enums/FtxOrderTypeEnum'



// TODO: Describe order interface for Ftx exchange
export interface IFtxOrderSchema {
  id: string
  symbol: string
  type: FtxOrderTypeEnum
  // ...
}
