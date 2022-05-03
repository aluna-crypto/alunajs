import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId'
import { IBittrexBalanceSchema } from '../../../schemas/IBittrexBalanceSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IBittrexBalanceSchema>,
): IAlunaBalanceParseReturns => {

  const { rawBalance } = params

  const {
    total,
    available,
    currencySymbol,
  } = rawBalance

  const symbolId = translateSymbolId({
    exchangeSymbolId: currencySymbol,
    symbolMappings: exchange.settings.mappings,
  })

  const balance: IAlunaBalanceSchema = {
    symbolId,
    wallet: AlunaWalletEnum.EXCHANGE,
    available: Number(available),
    total: Number(total),
    meta: rawBalance,
  }

  return { balance }

}
