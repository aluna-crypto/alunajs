import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
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
  side: AlunaSideEnum.LONG,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('2022-03-04T11:21:04.900Z'),
  meta: {
  },
}
