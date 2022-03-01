import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexAccountsAdapter } from '../../enums/adapters/BitfinexAccountsAdapter'
import { BitfinexOrderStatusAdapter } from '../../enums/adapters/BitfinexOrderStatusAdapter'
import { BitfinexOrderTypeAdapter } from '../../enums/adapters/BitfinexOrderTypeAdapter'
import { IBitfinexOrderSchema } from '../IBitfinexOrderSchema'
import { BitfinexSymbolParser } from './BitfinexSymbolParser'



export class BitfinexOrderParser {

  static parse (params: {
    rawOrder: IBitfinexOrderSchema,
  }): IAlunaOrderSchema {

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

    let {
      baseSymbolId,
      quoteSymbolId,
    } = BitfinexSymbolParser.splitSymbolPair({ symbolPair })

    const symbolMappings = Bitfinex.settings.mappings

    baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseSymbolId,
      symbolMappings,
    })

    quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteSymbolId,
      symbolMappings,
    })

    const status = BitfinexOrderStatusAdapter.translateToAluna({
      from: orderStatus,
    })

    const account = BitfinexAccountsAdapter.translateToAluna({
      value: orderType,
    })

    const type = BitfinexOrderTypeAdapter.translateToAluna({
      from: orderType,
    })

    const side = amountOrig > 0
      ? AlunaSideEnum.LONG
      : AlunaSideEnum.SHORT

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

    const parsedOrder: IAlunaOrderSchema = {
      id,
      symbolPair,
      exchangeId: Bitfinex.ID,
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

    return parsedOrder

  }

}
