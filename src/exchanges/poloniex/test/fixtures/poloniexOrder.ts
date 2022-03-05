import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexOrderTypeEnum } from '../../enums/PoloniexOrderTypeEnum'
import { IPoloniexOrderWithCurrency } from '../../schemas/IPoloniexOrderSchema'



export const POLONIEX_RAW_LIMIT_ORDER: IPoloniexOrderWithCurrency = {
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
  baseCurrency: 'BUSD',
  quoteCurrency: 'BNB',
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
  side: AlunaOrderSideEnum.SELL,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('2022-02-21T16:48:46.000Z'),
  meta: {},
}
