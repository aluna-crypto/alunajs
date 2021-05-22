import {
  IAlunaMarket,
} from '../../../../lib/modules/IAlunaMarket'
import {
  IAlunaMarketSchema,
} from '../../../../lib/schemas/IAlunaMarketSchema'
import {
  ValrPublicRequest,
} from '../requests/ValrPublicRequest'
import {
  IValrMarketSchema,
} from '../schemas/IValrMarketSchema'



interface IMarketWithBaseQuoteCurr extends IValrMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}



export class ValrMarket extends ValrPublicRequest implements IAlunaMarket {

  private availableCurrencyVolume: Record<string, string> = {}

  public async list (): Promise <IAlunaMarketSchema[]> {

    const rawMarkets = await this.post<IValrMarketSchema[]>({
      url: '/symbols',
      params: {},
    })

    const parsedMarkets = this.parseMany({
      rawMarkets,
    })

    return parsedMarkets

  }



  public parse (
    params: {
      rawMarket: IValrMarketSchema,
    },
  ): IAlunaMarketSchema {

    // TODO: implement me
    const x: any = params
    return x

  }



  public parseMany (
    params: {
      rawMarkets: IValrMarketSchema[],
    },
  ): IAlunaMarketSchema[] {

    return params.rawMarkets.map((rawMarket: IValrMarketSchema) => this.parse({
      rawMarket,
    }))

  }

  private separeteCurrencyPairs (
    params: {
      rawMarkets: IValrMarketSchema[],
      rawSymbols: IValrCurrencyPairs[]
    },
  ): IMarketWithBaseQuoteCurr[] {

    const {
      rawMarkets, rawSymbols,
    } = params

    return rawMarkets.reduce((cumulator, current) => {



      const rawSymbol = rawSymbols.find(
        (eachItem) => eachItem.symbol === current.currencyPair,
      )

      if (rawSymbol) {

        const {
          baseVolume,
        } = current

        const {
          baseCurrency,
          quoteCurrency,
        } = rawSymbol

        Object.assign(this.availableCurrencyVolume, {
          [baseCurrency]: baseVolume,
        })

        cumulator.push({
          ...current,
          baseCurrency,
          quoteCurrency,
        })

      }

      return cumulator

    }, [] as IMarketWithBaseQuoteCurr[])

  }

}
