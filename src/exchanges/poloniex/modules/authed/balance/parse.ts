import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IPoloniexBalanceSchema } from '../../../schemas/IPoloniexBalanceSchema'



// const log = debug('@alunajs:exchanges/poloniex/balance/parse')



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IPoloniexBalanceSchema>,
): IAlunaBalanceParseReturns => {

  // log('parse balance', params)

  const {
    rawBalance,
  } = params

  const {
    available,
    currency,
    onOrders,
  } = rawBalance

  const {
    settings,
    id,
  } = exchange

  const { symbolMappings } = settings

  const symbolId = translateSymbolId({
    exchangeSymbolId: currency,
    symbolMappings,
  })

  const total = Number(available) + Number(onOrders)

  const balance: IAlunaBalanceSchema = {
    symbolId,
    exchangeId: id,
    wallet: AlunaWalletEnum.EXCHANGE,
    available: Number(available),
    total,
    meta: rawBalance,
  }

  return { balance }

}
