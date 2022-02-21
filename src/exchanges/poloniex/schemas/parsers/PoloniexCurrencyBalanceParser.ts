import {
  IPoloniexBalanceSchema,
  IPoloniexBalanceWithCurrency,
} from '../IPoloniexBalanceSchema'



export class PoloniexCurrencyBalanceParser {

  static parse (params: {
        rawBalances: IPoloniexBalanceSchema,
    }): IPoloniexBalanceWithCurrency[] {

    const {
      rawBalances,
    } = params

    const currencies = Object.keys(rawBalances)

    const rawBalancesWithCurrency = currencies
      .reduce<IPoloniexBalanceWithCurrency[]>((cumulator, current) => {

        const rawTicker = rawBalances[current]

        cumulator.push({
          currency: current,
          ...rawTicker,
        })

        return cumulator

      }, [])

    return rawBalancesWithCurrency

  }

}

