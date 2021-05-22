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
  IValrCurrencyPairs,
} from '../schemas/IValrCurrencyPairs'
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

    const rawMarkets = await this.get<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    const rawSymbols = await this.get<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })

    const rawMarketWithCurrPair = this.separeteCurrencyPairs({
      rawMarkets,
      rawSymbols,
    })

    return this.parseMany({
      rawMarkets: rawMarketWithCurrPair,
    })

  }



  public parse (
    params: {
      rawMarket: IMarketWithBaseQuoteCurr,
    },
  ): IAlunaMarketSchema {

    const {
      rawMarket: {
        askPrice,
        baseVolume,
        bidPrice,
        changeFromPrevious,
        highPrice,
        lastTradedPrice,
        lowPrice,
        baseCurrency,
        quoteCurrency,
      },
    } = params

    const quoteVolume = Number(this.availableCurrencyVolume[quoteCurrency]) || 0

    const ticker = {
      high: parseFloat(highPrice),
      low: parseFloat(lowPrice),
      bid: parseFloat(bidPrice),
      ask: parseFloat(askPrice),
      last: parseFloat(lastTradedPrice),
      date: new Date(new Date().toDateString()),
      change: parseFloat(changeFromPrevious) / 100,
      baseVolume: parseFloat(baseVolume),
      quoteVolume,
    }

    return {
      pairSymbol: `${baseCurrency}/${quoteCurrency}`,
      ticker,
      spotEnabled: false,
      marginEnabled: false,
      derivativesEnabled: false,
    }

  }



  public parseMany (
    params: {
      rawMarkets: IMarketWithBaseQuoteCurr[],
    },
  ): IAlunaMarketSchema[] {

    return params.rawMarkets.map(
      (rawMarket: IMarketWithBaseQuoteCurr) => this.parse({
        rawMarket,
      }),
    )

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
