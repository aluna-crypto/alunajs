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

  let closedAt: Date | undefined
  let closePrice: number | undefined
  let status: AlunaPositionStatusEnum

  let basePrice: number
  let openPrice: number
  let amount: number
  let total: number
  let pl: number
  let plPercentage: number
  let liquidationPrice: number
  let leverage: number

  const openedAt = new Date()
  const isOpen = size !== 0

  if (isOpen) {

    status = AlunaPositionStatusEnum.OPEN

    total = Math.abs(cost)
    amount = Math.abs(size)

    basePrice = entryPrice
    openPrice = (cost - realizedPnl) / size

    pl = realizedPnl
    plPercentage = (((basePrice - openPrice) / openPrice) * 100)
    liquidationPrice = estimatedLiquidationPrice || -1
    leverage = Math.round((1 / initialMarginRequirement))

  } else {

    status = AlunaPositionStatusEnum.CLOSED
    closedAt = new Date()
    closePrice = entryPrice

    total = -1
    amount = -1

    basePrice = -1
    openPrice = -1

    pl = -1
    plPercentage = -1
    liquidationPrice = -1
    leverage = -1

  }

  const computedSide = side === FtxOrderSideEnum.BUY
    ? AlunaPositionSideEnum.LONG
    : AlunaPositionSideEnum.SHORT


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
