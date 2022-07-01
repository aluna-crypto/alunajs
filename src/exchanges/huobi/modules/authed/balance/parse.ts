import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IHuobiBalanceSchema } from '../../../schemas/IHuobiBalanceSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IHuobiBalanceSchema>,
): IAlunaBalanceParseReturns => {

  const { rawBalance } = params

  const {
    currency,
    balance: total,
  } = rawBalance

  const {
    settings,
    id: exchangeId,
  } = exchange

  const { symbolMappings } = settings

  const symbolId = translateSymbolId({
    exchangeSymbolId: currency,
    symbolMappings,
  })

  const balance: IAlunaBalanceSchema = {
    symbolId,
    available: Number(total),
    total: Number(total),
    wallet: AlunaWalletEnum.SPOT,
    exchangeId,
    meta: rawBalance,
  }

  return { balance }

}
