import BigNumber from 'bignumber.js'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitmex } from '../../Bitmex'
import { BitmexSettlementCurrencyEnum } from '../../enums/BitmexSettlementCurrencyEnum'
import { IBitmexBalanceSchema } from '../IBitmexBalanceSchema'



export class BitmexBalanceParser {

  public static parse (params: {
    rawBalance: IBitmexBalanceSchema,
  }): IAlunaBalanceSchema {

    const { rawBalance } = params

    const {
      currency,
      walletBalance,
      availableMargin,
    } = rawBalance

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings: Bitmex.settings.mappings,
    })

    let computedAvailable: number
    let computedTotal: number

    if (walletBalance <= 0) {

      computedAvailable = 0
      computedTotal = 0

    } else {

      let multiplier: number

      switch (currency) {

        case (BitmexSettlementCurrencyEnum.BTC):

          multiplier = 10 ** -8

          break

        case (BitmexSettlementCurrencyEnum.USDT):

          multiplier = 10 ** -6

          break

        default:

          multiplier = 1

      }

      computedAvailable = new BigNumber(availableMargin)
        .times(multiplier)
        .toNumber()

      computedTotal = new BigNumber(walletBalance)
        .times(multiplier)
        .toNumber()

    }

    const balance: IAlunaBalanceSchema = {
      symbolId,
      account: AlunaAccountEnum.DERIVATIVES,
      available: computedAvailable,
      total: computedTotal,
      meta: rawBalance,
    }

    return balance

  }

}
