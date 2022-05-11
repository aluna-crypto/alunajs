import { IBitmexMarketSchema } from '../../../../schemas/IBitmexMarketSchema'



export const resolveSymbolsIds = (params: {
    rawMarket: IBitmexMarketSchema
  }): {
    rateSymbolId: string
    totalSymbolId: string
    amountSymbolId: string
  } => {

  const { rawMarket } = params

  const {
    isQuanto,
    isInverse,
    settlCurrency,
    quoteCurrency,
    positionCurrency,
  } = rawMarket

  let amountSymbolId: string

  if (isQuanto) {

    amountSymbolId = 'Cont'

  } else if (isInverse) {

    amountSymbolId = quoteCurrency

  } else {

    amountSymbolId = positionCurrency

  }

  const rateSymbolId = quoteCurrency

  const totalSymbolId = settlCurrency.toUpperCase()

  return {
    rateSymbolId,
    totalSymbolId,
    amountSymbolId,
  }

}

