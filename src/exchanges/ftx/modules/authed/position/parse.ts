import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionSideEnum } from '../../../../../lib/enums/AlunaPositionSideEnum'
import { AlunaPositionStatusEnum } from '../../../../../lib/enums/AlunaPositionStatusEnum'
import {
  IAlunaPositionParseParams,
  IAlunaPositionParseReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { FtxOrderSideEnum } from '../../../enums/FtxOrderSideEnum'
import { IFtxPositionSchema } from '../../../schemas/IFtxPositionSchema'
import { splitFtxSymbolPair } from '../../public/market/helpers/splitFtxSymbolPair'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseParams<IFtxPositionSchema>,
): IAlunaPositionParseReturns => {

  const { rawPosition } = params

  const {
    future,
    size,
    side,
    // netSize,
    // longOrderSize,
    // shortOrderSize,
    cost,
    entryPrice,
    // unrealizedPnl,
    realizedPnl,
    initialMarginRequirement,
    // maintenanceMarginRequirement,
    // openSize,
    // collateralUsed,
    estimatedLiquidationPrice,
  } = rawPosition

  let {
    baseSymbolId,
    quoteSymbolId,
  } = splitFtxSymbolPair({ market: future })

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })


  const openedAt = new Date()

  let closedAt: Date | undefined
  let closePrice: number | undefined
  let status: AlunaPositionStatusEnum

  if (size === 0) {

    closedAt = new Date()
    closePrice = entryPrice
    status = AlunaPositionStatusEnum.CLOSED

  } else {

    status = AlunaPositionStatusEnum.OPEN

  }


  const computedSide = side === FtxOrderSideEnum.BUY
    ? AlunaPositionSideEnum.LONG
    : AlunaPositionSideEnum.SHORT

  const amount = Math.abs(size)
  const basePrice = entryPrice
  const openPrice = entryPrice

  const total = Math.abs(cost)

  const pl = realizedPnl
  const plPercentage = (realizedPnl / 100)
  const liquidationPrice = estimatedLiquidationPrice || -1
  const leverage = Math.round((1 / initialMarginRequirement))


  const position: IAlunaPositionSchema = {
    symbolPair: future,
    exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    total,
    amount,
    account: AlunaAccountEnum.DERIVATIVES,
    status,
    side: computedSide,
    basePrice,
    openPrice,
    pl,
    plPercentage,
    leverage,
    liquidationPrice,
    openedAt,
    closedAt,
    closePrice,
    meta: rawPosition,
  }

  return { position }

}
