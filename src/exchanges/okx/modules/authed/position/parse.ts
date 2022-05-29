import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import {
  IAlunaPositionParseParams,
  IAlunaPositionParseReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { translatePositionSideToAluna } from '../../../enums/adapters/okxPositionSideAdapter'
import { IOkxPositionSchema } from '../../../schemas/IOkxPositionSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseParams<IOkxPositionSchema>,
): IAlunaPositionParseReturns => {

  const { rawPosition } = params

  const {
    instId,
    posSide,
    avgPx,
    last,
    posId,
    upl,
    uplRatio,
    lever,
    cTime,
    baseBal,
    liqPx,
  } = rawPosition

  let [
    baseSymbolId,
    quoteSymbolId,
  ] = instId.split('/')


  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const side = translatePositionSideToAluna({
    from: posSide,
  })

  const basePrice = Number(last)
  const openPrice = Number(avgPx)
  const amount = Number(baseBal)
  const total = amount * basePrice
  const pl = parseFloat(upl)
  const plPercentage = parseFloat(uplRatio)
  const leverage = Number(lever)
  const openedAt = new Date(Number(cTime))
  const liquidationPrice = Number(liqPx)
  const status = AlunaPositionStatusEnum.OPEN

  const position: IAlunaPositionSchema = {
    id: posId,
    symbolPair: instId,
    exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    total,
    amount,
    account: AlunaAccountEnum.MARGIN,
    status,
    side,
    basePrice,
    openPrice,
    pl,
    plPercentage,
    leverage,
    liquidationPrice,
    openedAt,
    closedAt: undefined, // @TODO -> Verify value
    closePrice: undefined, // @TODO -> Verify value
    meta: rawPosition,
  }

  return { position }

}
