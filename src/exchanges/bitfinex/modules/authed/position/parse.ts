import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import {
  IAlunaPositionParseParams,
  IAlunaPositionParseReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translatePositionSideToAluna } from '../../../enums/adapters/bitfinexPositionSideAdapter'
import { BitfinexPositionStatusEnum } from '../../../enums/BitfinexPositionStatusEnum'
import { IBitfinexPositionSchema } from '../../../schemas/IBitfinexPositionSchema'
import { splitSymbolPair } from '../../public/market/helpers/splitSymbolPair'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseParams<IBitfinexPositionSchema>,
): IAlunaPositionParseReturns => {

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
  } = splitSymbolPair({ symbolPair: symbol })


  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })


  const computedStatus = status === BitfinexPositionStatusEnum.ACTIVE
    ? AlunaPositionStatusEnum.OPEN
    : AlunaPositionStatusEnum.CLOSED

  const side = translatePositionSideToAluna({ amount })

  let computedAmount: number

  if (amount === 0) {

    computedAmount = meta.trade_amount
      ? Math.abs(Number(meta.trade_amount))
      : 0

  } else {

    computedAmount = Math.abs(amount)

  }

  const computedBasePrice = basePrice

  const computedOpenPrice = meta.trade_price
    ? Number(meta.trade_price)
    : basePrice

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
    id: positionId.toString(),
    symbolPair: symbol,
    exchangeId: exchange.specs.id,
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

  return { position }

}
