import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexOrderStatusEnum } from '../../enums/PoloniexOrderStatusEnum'
import { PoloniexOrderTypeEnum } from '../../enums/PoloniexOrderTypeEnum'
import { IPoloniexOrderStatusInfo } from '../../schemas/IPoloniexOrderSchema'



export const POLONIEX_RAW_LIMIT_ORDER: IPoloniexOrderStatusInfo = {
  orderNumber: '3810998527',
  type: PoloniexOrderTypeEnum.SELL,
  rate: '500.00000000',
  startingAmount: '0.00500000',
  amount: '0.00500000',
  total: '2.50000000',
  date: '2022-02-21 13:48:46',
  margin: 0,
  clientOrderId: '1234',
  currencyPair: 'BUSD_BNB',
  status: PoloniexOrderStatusEnum.OPEN,
}

export const POLONIEX_PARSED_ORDER: IAlunaOrderSchema = {
  id: '3810998527',
  symbolPair: 'BUSD_BNB',
  total: 2.5,
  amount: 0.005,
  rate: 500,
  exchangeId: 'poloniex',
  baseSymbolId: 'BUSD',
  quoteSymbolId: 'BNB',
  account: AlunaAccountEnum.EXCHANGE,
  side: AlunaSideEnum.SHORT,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('2022-02-21T16:48:46.000Z'),
  meta: {},
}
