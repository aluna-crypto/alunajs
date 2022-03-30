import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { FtxOrderStatusEnum } from '../../enums/FtxOrderStatusEnum'
import { FtxOrderTypeEnum } from '../../enums/FtxOrderTypeEnum'
import { FtxSideEnum } from '../../enums/FtxSideEnum'
import { IFtxOrderSchema } from '../../schemas/IFtxOrderSchema'



export const FTX_RAW_LIMIT_ORDER: IFtxOrderSchema = {
  id: 126107749540,
  clientId: 123,
  market: 'BNB/USD',
  type: FtxOrderTypeEnum.LIMIT,
  side: FtxSideEnum.BUY,
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
}

export const FTX_RAW_MARKET_ORDER: IFtxOrderSchema = {
  id: 126122300599,
  clientId: 123,
  market: 'BNB/USD',
  type: FtxOrderTypeEnum.MARKET,
  side: FtxSideEnum.BUY,
  price: null,
  size: 3,
  status: FtxOrderStatusEnum.OPEN,
  filledSize: 0,
  remainingSize: 3,
  reduceOnly: false,
  avgFillPrice: null,
  postOnly: false,
  ioc: true,
  createdAt: '2022-03-04T12:46:02.053004+00:00',
  future: 'BNB/USD',
}


export const FTX_PARSED_ORDER: IAlunaOrderSchema = {
  id: 126107749540,
  symbolPair: 'BNB/USD',
  total: 2.99,
  amount: 2.99,
  rate: 1,
  exchangeId: 'ftx',
  baseSymbolId: 'BNB',
  quoteSymbolId: 'USD',
  account: AlunaAccountEnum.EXCHANGE,
  side: AlunaOrderSideEnum.BUY,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('2022-03-04T11:21:04.900Z'),
  meta: {
  },
}
