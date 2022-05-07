import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionParseParams,
  IAlunaPositionParseReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../../../lib/schemas/IAlunaPositionSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { ISamplePositionSchema } from '../../../schemas/ISamplePositionSchema'



// const log = debug('@alunajs:sample/position/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaPositionParseParams<ISamplePositionSchema>,
): IAlunaPositionParseReturns => {

  const { rawPosition } = params

  const { symbolPair } = rawPosition

  let [
    baseSymbolId,
    quoteSymbolId,
  ] = symbolPair.split('/')


  baseSymbolId = translateSymbolId({
    exchangeSymbolId: baseSymbolId,
    symbolMappings: exchange.settings.mappings,
  })

  quoteSymbolId = translateSymbolId({
    exchangeSymbolId: quoteSymbolId,
    symbolMappings: exchange.settings.mappings,
  })

  // TODO: Implement proper parser
  const position: IAlunaPositionSchema = {
    // id: rawPosition.id,
    symbolPair: rawPosition.symbolPair,
    // exchangeId: exchange.specs.id,
    baseSymbolId,
    quoteSymbolId,
    // total: rawPosition.total,
    // amount: rawPosition.amount,
    // account: AlunaAccountEnum.MARGIN,
    // status: rawPosition.status,
    // side: rawPosition.side,
    // basePrice: rawPosition.basePrice,
    // openPrice: rawPosition.openPrice,
    // pl: rawPosition.pl,
    // plPercentage: rawPosition.plPercentage,
    // leverage: rawPosition.leverage,
    // liquidationPrice: rawPosition.liquidationPrice,
    // openedAt: rawPosition.openedAt,
    // closedAt: rawPosition.closedAt,
    // closePrice: rawPosition.closePrice,
    // meta: rawPosition,
  } as any // TODO: Remove casting to any

  return { position }

}
