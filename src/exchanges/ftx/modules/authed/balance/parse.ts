import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IFtxBalanceSchema } from '../../../schemas/IFtxBalanceSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IFtxBalanceSchema>,
): IAlunaBalanceParseReturns => {

  const { rawBalance } = params

  const {
    free,
    total,
    coin,
  } = rawBalance

  const { symbolMappings } = exchange.settings

  const symbolId = translateSymbolId({
    exchangeSymbolId: coin,
    symbolMappings,
  })

  const balance: IAlunaBalanceSchema = {
    symbolId,
    available: free,
    total,
    wallet: AlunaWalletEnum.TRADING,
    exchangeId: exchange.specs.id,
    meta: rawBalance,
  }

  return { balance }

}
