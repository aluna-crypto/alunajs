import { FtxOrderTypeEnum } from '../../enums/FtxOrderTypeEnum'
import { IFtxOrderSchema } from '../../schemas/IFtxOrderSchema'



// TODO: Review fixtures
export const FTX_RAW_ORDERS: IFtxOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbol: 'BTC/USD',
    type: FtxOrderTypeEnum.LIMIT,
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbol: 'ETH/USD',
    type: FtxOrderTypeEnum.MARKET,
  },
]
