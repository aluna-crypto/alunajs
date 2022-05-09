import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { gateBaseSpecs } from '../../../gateSpecs'
import { IGateBalanceSchema } from '../../../schemas/IGateBalanceSchema'



// const log = debug('@alunajs:exchanges/gate/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IGateBalanceSchema>,
): IAlunaBalanceParseReturns => {

  // log('parse balance', params)

  const {
    rawBalance,
  } = params

  const {
    currency,
    available,
    locked,
  } = rawBalance

  const symbolId = translateSymbolId({
    exchangeSymbolId: currency,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const balance: IAlunaBalanceSchema = {
    symbolId,
    exchangeId: gateBaseSpecs.id,
    wallet: AlunaWalletEnum.EXCHANGE,
    available: Number(available),
    total: Number(available) + Number(locked),
    meta: rawBalance,
  }

  return { balance }

}
