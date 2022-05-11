import BigNumber from 'bignumber.js'

import { BitmexSettlementCurrencyEnum } from '../../../../enums/BitmexSettlementCurrencyEnum'
import { IBitmexMarketSchema } from '../../../../schemas/IBitmexMarketSchema'



export const computeContractValue = (params: {
    rawMarket: IBitmexMarketSchema
  }): number => {

  const { rawMarket } = params

  const {
    isQuanto,
    markPrice,
    multiplier,
    settlCurrency,
  } = rawMarket

  let contractValue = 0

  const absoluteMultiplier = Math.abs(Number(multiplier))

  if (settlCurrency === BitmexSettlementCurrencyEnum.BTC) {

    contractValue = new BigNumber(absoluteMultiplier)
      .times(10 ** -8)
      .toNumber()

    if (isQuanto) {

      contractValue = new BigNumber(contractValue)
        .times(markPrice)
        .toNumber()

    }

  } else {

    contractValue = new BigNumber(absoluteMultiplier)
      .times(10 ** -6)
      .toNumber()

  }

  return contractValue

}
