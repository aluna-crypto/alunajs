import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IBinanceBalanceSchema } from '../../../schemas/IBinanceBalanceSchema'



// const log = debug('@alunajs:exchanges/binance/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IBinanceBalanceSchema>,
): IAlunaBalanceParseReturns => {

  // log('parse balance', params)

  const {
    rawBalance,
  } = params

  const {
    asset,
    free,
    locked,
  } = rawBalance

  const { symbolMappings } = exchange.settings

  const symbolId = translateSymbolId({
    exchangeSymbolId: asset,
    symbolMappings,
  })

  const available = Number(free)

  const total = available + Number(locked)

  const balance: IAlunaBalanceSchema = {
    symbolId,
    available,
    total,
    wallet: AlunaWalletEnum.SPOT,
    meta: rawBalance,
  }

  return { balance }

}
