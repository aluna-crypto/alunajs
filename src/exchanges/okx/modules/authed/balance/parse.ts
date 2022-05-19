import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IOkxBalanceSchema } from '../../../schemas/IOkxBalanceSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IOkxBalanceSchema>,
): IAlunaBalanceParseReturns => {

  const { rawBalance } = params

  const {
    availBal,
    frozenBal,
    ccy,
  } = rawBalance

  const { settings, specs } = exchange

  const { symbolMappings } = settings

  const { id: exchangeId } = specs

  const available = Number(availBal)

  const total = available + Number(frozenBal)

  const symbolId = translateSymbolId({
    exchangeSymbolId: ccy,
    symbolMappings,
  })

  const balance: IAlunaBalanceSchema = {
    available,
    symbolId,
    total,
    wallet: AlunaWalletEnum.SPOT,
    exchangeId,
    meta: rawBalance,
  }

  return { balance }

}
