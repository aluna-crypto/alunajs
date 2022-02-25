import BigNumber from 'bignumber.js'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
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

    let symbolId: string

    // TODO: Apply mapping here
    if (currency === 'XBt') {

      symbolId = 'BTC'

    } else if (currency === 'USDt') {

      symbolId = 'USDT'

    } else {

      symbolId = currency

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
