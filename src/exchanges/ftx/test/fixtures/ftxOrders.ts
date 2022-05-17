import { FtxOrderSideEnum } from '../../enums/FtxOrderSideEnum'
import { FtxOrderStatusEnum } from '../../enums/FtxOrderStatusEnum'
import { FtxOrderTypeEnum } from '../../enums/FtxOrderTypeEnum'
import { IFtxOrderSchema } from '../../schemas/IFtxOrderSchema'



export const FTX_RAW_ORDERS: IFtxOrderSchema[] = [
  {
    id: 126107749540,
    clientId: 123,
    market: 'BNB/USD',
    type: FtxOrderTypeEnum.LIMIT,
    side: FtxOrderSideEnum.BUY,
    price: 1,
    size: 2.99,
    status: FtxOrderStatusEnum.OPEN,
    filledSize: 0,
    remainingSize: 2.99,
    reduceOnly: false,
    avgFillPrice: 0,
    postOnly: false,
    ioc: false,
    createdAt: '2022-03-04T11:21:04.900507+00:00',
    future: 'BNB/USD',
  },
  {
    id: 126122300599,
    clientId: 123,
    market: 'BNB/USD',
    type: FtxOrderTypeEnum.MARKET,
    side: FtxOrderSideEnum.BUY,
    price: null,
    size: 3,
    status: FtxOrderStatusEnum.OPEN,
    filledSize: 0,
    remainingSize: 3,
    reduceOnly: false,
    avgFillPrice: 5,
    postOnly: false,
    ioc: true,
    createdAt: '2022-03-04T12:46:02.053004+00:00',
    future: 'BNB/USD',
  },
]
