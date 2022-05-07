import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderParseParams,
  IAlunaOrderParseReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { translateAccountToAluna } from '../../../enums/adapters/bitfinexAccountsAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/bitfinexOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/bitfinexOrderTypeAdapter'
import { IBitfinexOrderSchema } from '../../../schemas/IBitfinexOrderSchema'



const log = debug('@alunajs:bitfinex/order/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaOrderParseParams<IBitfinexOrderSchema>,
): IAlunaOrderParseReturns => {

  log('params', params)

  const {
    rawOrder,
  } = params

  const [
    id,
    _gid,
    _cid,
    symbolPair,
    mtsCreate,
    mtsUpdate,
    _amount,
    amountOrig,
    orderType,
    _typePrev,
    _placeholder1,
    _placeholder2,
    _flags,
    orderStatus,
    _placeholder3,
    _placeholder4,
    price,
    priceAvg,
    _priceTrailing,
    priceAuxLimit,
  ] = rawOrder


  let baseSymbolId: string
  let quoteSymbolId: string

  const spliter = symbolPair.indexOf(':')

  if (spliter >= 0) {

    baseSymbolId = symbolPair.slice(1, spliter)
    quoteSymbolId = symbolPair.slice(spliter + 1)

  } else {

    baseSymbolId = symbolPair.slice(1, 4)
    quoteSymbolId = symbolPair.slice(4)

  }

  const symbolMappings = bitfinexBaseSpecs.settings.mappings

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings,
  })

  const status = translateOrderStatusToAluna({
    from: orderStatus,
  })

  const account = translateAccountToAluna({
    value: orderType,
  })

  const type = translateOrderTypeToAluna({
    from: orderType,
  })

  const side = amountOrig > 0
    ? AlunaOrderSideEnum.BUY
    : AlunaOrderSideEnum.SELL

  const amount = Math.abs(amountOrig)

  let rate: number | undefined
  let stopRate: number | undefined
  let limitRate: number | undefined

  const fixedPrice = price || priceAvg
  let computedPrice = fixedPrice

  if (type === AlunaOrderTypesEnum.STOP_LIMIT) {

    stopRate = fixedPrice
    limitRate = priceAuxLimit
    computedPrice = priceAuxLimit

  } else if (type === AlunaOrderTypesEnum.STOP_MARKET) {

    stopRate = fixedPrice

  } else {

    rate = fixedPrice

  }

  let filledAt: Date | undefined
  let canceledAt: Date | undefined

  if (status === AlunaOrderStatusEnum.FILLED) {

    filledAt = new Date(mtsUpdate)

  } else if (status === AlunaOrderStatusEnum.CANCELED) {

    canceledAt = new Date(mtsUpdate)

  }

  const order: IAlunaOrderSchema = {
    id: id.toString(),
    symbolPair,
    exchangeId: bitfinexBaseSpecs.id,
    baseSymbolId,
    quoteSymbolId,
    total: (amount * computedPrice),
    amount,
    rate,
    stopRate,
    limitRate,
    account,
    side,
    status,
    type,
    placedAt: new Date(mtsCreate),
    filledAt,
    canceledAt,
    meta: rawOrder,
  }

  return { order }

}
