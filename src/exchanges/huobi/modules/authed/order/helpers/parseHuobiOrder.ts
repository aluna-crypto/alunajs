import BigNumber from 'bignumber.js'

import { AlunaAccountEnum } from '../../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderParseReturns } from '../../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../../lib/schemas/IAlunaOrderSchema'
import { translateOrderSideToAluna } from '../../../../enums/adapters/huobiOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../../enums/adapters/huobiOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../../enums/adapters/huobiOrderTypeAdapter'
import { IHuobiOrderSchema } from '../../../../schemas/IHuobiOrderSchema'



export interface IParseHuobiOrderParams {
  exchangeId: string
  baseSymbolId: string
  quoteSymbolId: string
  huobiOrder: IHuobiOrderSchema
}



export const parseHuobiOrder = (
  params: IParseHuobiOrderParams,
): IAlunaOrderParseReturns => {

  const {
    exchangeId,
    baseSymbolId,
    quoteSymbolId,
    huobiOrder,
  } = params

  const {
    symbol,
    price,
    type,
    'created-at': createdAt,
    amount,
    state,
    'stop-price': stopPrice,
    id,
  } = huobiOrder as IHuobiOrderSchema

  const orderStatus = translateOrderStatusToAluna({
    from: state,
  })

  const placedAt = new Date(createdAt)
  let filledAt: Date | undefined
  let canceledAt: Date | undefined

  if (orderStatus === AlunaOrderStatusEnum.FILLED) {

    filledAt = new Date()

  } else if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

    canceledAt = new Date()

  }

  const side = translateOrderSideToAluna({
    type,
  })

  const computedType = translateOrderTypeToAluna({
    from: type,
  })

  let rate
  let limitRate
  let stopRate
  let total
  let computedAmount

  switch (computedType) {

    case AlunaOrderTypesEnum.STOP_LIMIT:
      limitRate = Number(price)
      stopRate = Number(stopPrice)
      computedAmount = Number(amount)
      total = limitRate * Number(computedAmount)
      break
    case AlunaOrderTypesEnum.LIMIT:
      rate = Number(price)
      computedAmount = Number(amount)
      total = rate * Number(computedAmount)
      break

    default:
      /**
       * For Market orders the amount property is given not in the base currency
       * but in the quote currency instead.
       */
      rate = Number(price)
      total = Number(amount)
      computedAmount = new BigNumber(amount)
        .div(price)
        .toNumber()

  }

  const order: IAlunaOrderSchema = {
    id: id.toString(),
    symbolPair: symbol,
    account: AlunaAccountEnum.SPOT,
    exchangeId,
    baseSymbolId,
    quoteSymbolId,
    placedAt,
    canceledAt,
    filledAt,
    rate,
    stopRate,
    limitRate,
    total,
    side,
    amount: computedAmount,
    status: orderStatus,
    type: computedType,
    meta: huobiOrder,
  }

  return { order }

}
