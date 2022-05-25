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



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseParams<any>,
): IAlunaPositionParseReturns => {

  const { rawPosition } = params

  const {
    future,
    size,
    side,
    _netSize,
    _longOrderSize,
    _shortOrderSize,
    cost,
    entryPrice,
    _unrealizedPnl,
    realizedPnl,
    initialMarginRequirement,
    _maintenanceMarginRequirement,
    _openSize,
    _collateralUsed,
    estimatedLiquidationPrice,
  } = rawPosition

  let [baseSymbolId] = future.split('-')
  const quoteSymbolId = 'USD'

  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const openedAt = new Date()

  let closedAt: Date | undefined
  let closePrice: number | undefined

  if (size === 0) {

    closedAt = new Date()
    closePrice = entryPrice

  }

  const status = size === 0
    ? AlunaPositionStatusEnum.CLOSED
    : AlunaPositionStatusEnum.OPEN

  const computedSide = side === 'buy'
    ? AlunaPositionSideEnum.LONG
    : AlunaPositionSideEnum.SHORT

  const amount = Math.abs(size)
  const basePrice = entryPrice
  const openPrice = (realizedPnl * -1) + entryPrice

  const total = Math.abs(cost)

  const pl = realizedPnl
  const plPercentage = (openPrice * (realizedPnl / 100))
  const liquidationPrice = estimatedLiquidationPrice
  const leverage = (1 / initialMarginRequirement)


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
