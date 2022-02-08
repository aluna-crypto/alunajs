import {
  AlunaAccountEnum,
  AlunaPositionStatusEnum,
  IAlunaPositionSchema,
} from '../../../..'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexSideAdapter } from '../../enums/adapters/BitfinexSideAdapter'
import { BitfinexPositionStatusEnum } from '../../enums/BitfinexPositionStatusEnum'
import { IBitfinexPositionSchema } from '../IBitfinexPositionSchema'



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
      _positionId,
      mtsCreate,
      _mtsUpdate,
      _placeholder2,
      _type,
      _placeholder3,
      _collateral,
      _collateralMin,
      _meta,
    ] = rawPosition


    let baseSymbolId: string
    let quoteSymbolId: string

    const spliter = symbol.indexOf(':')

    if (spliter >= 0) {

      baseSymbolId = symbol.slice(1, spliter)
      quoteSymbolId = symbol.slice(spliter)

    } else {

      baseSymbolId = symbol.slice(1, 4)
      quoteSymbolId = symbol.slice(4)

    }

    const computedStatus = status === BitfinexPositionStatusEnum.ACTIVE
      ? AlunaPositionStatusEnum.OPEN
      : AlunaPositionStatusEnum.CLOSED

    const side = BitfinexSideAdapter.translateToAluna({
      value: amount,
    })

    const computedBasePrice = Number(basePrice)
    const computedAmount = Math.abs(Number(amount))
    const total = computedAmount * computedBasePrice

    const computedPl = pl !== null ? pl : 0
    const plPercentage = plPerc !== null ? plPerc : 0
    const liquidationPrice = priceLiq !== null ? priceLiq : 0
    const computedLeverage = leverage !== null ? leverage : 0

    const position: IAlunaPositionSchema = {
      symbolPair: symbol,
      baseSymbolId,
      quoteSymbolId,
      exchangeId: Bitfinex.ID,
      total,
      amount: computedAmount,
      account: AlunaAccountEnum.MARGIN,
      status: computedStatus,
      side,
      basePrice: Number(basePrice),
      openPrice: computedBasePrice,
      pl: computedPl,
      plPercentage,
      leverage: computedLeverage,
      liquidationPrice,
      openedAt: new Date(mtsCreate),
      meta: rawPosition,
    }

    return position

  }

}
