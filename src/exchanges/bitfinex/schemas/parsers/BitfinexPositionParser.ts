import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { IAlunaPositionSchema } from '../../../../lib/schemas/IAlunaPositionSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexPositionSideAdapter } from '../../enums/adapters/BitfinexPositionSideAdapter'
import { BitfinexPositionStatusEnum } from '../../enums/BitfinexPositionStatusEnum'
import { IBitfinexPositionSchema } from '../IBitfinexPositionSchema'
import { BitfinexSymbolParser } from './BitfinexSymbolParser'



export class BitfinexPositionParser {

  static parse (params: {
    rawPosition: IBitfinexPositionSchema,
  }) {

    const { rawPosition } = params

    const [
      symbol,
      status,
      amount,
      basePrice,
      _funding,
      _fundingType,
      pl,
      plPerc,
      priceLiq,
      leverage,
      _placeholder1,
      positionId,
      mtsCreate,
      mtsUpdate,
      _placeholder2,
      _type,
      _placeholder3,
      _collateral,
      _collateralMin,
      meta,
    ] = rawPosition

    let {
      baseSymbolId,
      quoteSymbolId,
    } = BitfinexSymbolParser.splitSymbolPair({ symbolPair: symbol })

    const symbolMappings = Bitfinex.settings.mappings

    baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseSymbolId,
      symbolMappings,
    })

    quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteSymbolId,
      symbolMappings,
    })

    const computedStatus = status === BitfinexPositionStatusEnum.ACTIVE
      ? AlunaPositionStatusEnum.OPEN
      : AlunaPositionStatusEnum.CLOSED

    const side = BitfinexPositionSideAdapter.translateToAluna({
      amount,
    })

    let computedAmount: number

    if (amount === 0) {

      computedAmount = Math.abs(Number(meta.trade_amount))

    } else {

      computedAmount = Math.abs(amount)

    }

    const computedBasePrice = Number(basePrice)
    const computedOpenPrice = Number(meta.trade_price)

    const total = computedAmount * computedBasePrice

    const computedPl = pl !== null ? pl : 0
    const plPercentage = plPerc !== null ? plPerc : 0
    const liquidationPrice = priceLiq !== null ? priceLiq : 0
    const computedLeverage = leverage !== null ? leverage : 0

    const openedAt = mtsCreate
      ? new Date(mtsCreate)
      : new Date()

    let closedAt: Date | undefined
    let closePrice: number | undefined

    if (mtsUpdate && (computedStatus === AlunaPositionStatusEnum.CLOSED)) {

      closedAt = new Date(mtsUpdate)

      closePrice = computedBasePrice

    }

    const position: IAlunaPositionSchema = {
      id: positionId,
      symbolPair: symbol,
      exchangeId: Bitfinex.ID,
      baseSymbolId,
      quoteSymbolId,
      total,
      amount: computedAmount,
      account: AlunaAccountEnum.MARGIN,
      status: computedStatus,
      side,
      basePrice: computedBasePrice,
      openPrice: computedOpenPrice,
      pl: computedPl,
      plPercentage,
      leverage: computedLeverage,
      liquidationPrice,
      openedAt,
      closedAt,
      closePrice,
      meta: rawPosition,
    }

    return position

  }

}
