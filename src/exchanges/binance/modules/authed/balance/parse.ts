import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import {
  IBinanceMarginBalanceSchema,
  IBinanceSpotBalanceSchema,
} from '../../../schemas/IBinanceBalanceSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IBinanceSpotBalanceSchema | IBinanceMarginBalanceSchema>,
): IAlunaBalanceParseReturns => {


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

  let total: number
  let wallet: AlunaWalletEnum

  const available = Number(free)

  const marginTotal = (rawBalance as IBinanceMarginBalanceSchema).netAsset

  if (marginTotal) {

    total = Number(marginTotal)
    wallet = AlunaWalletEnum.MARGIN

  } else {

    total = available + Number(locked)
    wallet = AlunaWalletEnum.SPOT

  }

  const balance: IAlunaBalanceSchema = {
    symbolId,
    available,
    total,
    wallet,
    meta: rawBalance,
  }

  return { balance }

}
