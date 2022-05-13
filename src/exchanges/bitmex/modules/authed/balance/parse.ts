import BigNumber from 'bignumber.js'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaWalletEnum } from '../../../../../lib/enums/AlunaWalletEnum'
import {
  IAlunaBalanceParseParams,
  IAlunaBalanceParseReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { IBitmexBalanceSchema } from '../../../schemas/IBitmexBalanceSchema'



export const parse = (exchange: IAlunaExchangeAuthed) => (
  params: IAlunaBalanceParseParams<IBitmexBalanceSchema>,
): IAlunaBalanceParseReturns => {

  const { rawBalance } = params

  const {
    asset,
    assetDetails,
  } = rawBalance

  const {
    walletBalance,
    availableMargin,
  } = asset

  const {
    asset: symbol,
    scale,
  } = assetDetails

  const symbolId = translateSymbolId({
    exchangeSymbolId: symbol,
    symbolMappings: exchange.settings.symbolMappings,
  })

  let computedAvailable: number
  let computedTotal: number

  if (walletBalance <= 0) {

    computedAvailable = 0
    computedTotal = 0

  } else {

    const multiplier = new BigNumber(10).pow(-scale)

    computedAvailable = new BigNumber(availableMargin)
      .times(multiplier)
      .toNumber()

    computedTotal = new BigNumber(walletBalance)
      .times(multiplier)
      .toNumber()

  }

  const balance: IAlunaBalanceSchema = {
    symbolId,
    wallet: AlunaWalletEnum.TRADING,
    available: computedAvailable,
    total: computedTotal,
    meta: rawBalance,
  }

  return { balance }

}
