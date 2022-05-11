import { IBitmexMarketSchema } from '../../../../schemas/IBitmexMarketSchema'



export const computeContractCurrency = (params: {
    rawMarket: IBitmexMarketSchema
  }): string => {

  const { rawMarket } = params

  const {
    isQuanto,
    isInverse,
    rootSymbol,
    quoteCurrency,
  } = rawMarket

  let contractCurrency

  if (isQuanto) {

    contractCurrency = 'XBT'

  } else {

    contractCurrency = isInverse
      ? quoteCurrency
      : rootSymbol

  }

  return contractCurrency

}
