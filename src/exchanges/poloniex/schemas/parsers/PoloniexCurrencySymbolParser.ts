import {
  IPoloniexSymbolSchema,
  IPoloniexSymbolWithCurrency,
} from '../IPoloniexSymbolSchema'



export class PoloniexCurrencySymbolParser {

  static parse (params: {
        rawSymbols: IPoloniexSymbolSchema,
    }): IPoloniexSymbolWithCurrency[] {

    const {
      rawSymbols,
    } = params

    const currencies = Object.keys(rawSymbols)

    const rawSymbolsWithCurrency = currencies
      .reduce<IPoloniexSymbolWithCurrency[]>((cumulator, current) => {

        const rawTicker = rawSymbols[current]

        cumulator.push({
          currency: current,
          ...rawTicker,
        })

        return cumulator

      }, [])

    return rawSymbolsWithCurrency

  }

}

