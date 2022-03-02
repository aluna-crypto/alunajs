export interface IPoloniexCurrencySchema {
  [key: string]: any
}


export class PoloniexCurrencyParser {

  static parse <T> (params: {
        rawInfo: IPoloniexCurrencySchema,
      }): T[] {

    const {
      rawInfo,
    } = params

    const currencies = Object.keys(rawInfo)

    const rawInfoWithCurrency = currencies
      .reduce<T[]>((cumulator, current) => {

        const rawTicker = rawInfo[current]

        const isCurrencyPair = current.includes('_')

        if (isCurrencyPair) {

          const splittedMarketSymbol = current.split('_')
          const baseCurrency = splittedMarketSymbol[0]
          const quoteCurrency = splittedMarketSymbol[1]

          cumulator.push({
            currencyPair: current,
            baseCurrency,
            quoteCurrency,
            ...rawTicker,
          })

        } else {

          cumulator.push({
            currency: current,
            ...rawTicker,
          })

        }

        return cumulator

      }, [])

    return rawInfoWithCurrency

  }

}

