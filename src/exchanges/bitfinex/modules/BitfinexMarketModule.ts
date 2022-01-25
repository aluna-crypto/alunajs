import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'



export const BitfinexMarketModule = class {

  static spotTickersPath = 'pub:list:pair:exchange'
  static margingTickersPath = 'pub:list:pair:margin'

  public static async listRaw (): Promise<any[]> {

    BitfinexLog.info('fetching Bitfinex markets')

    const rawMarketsWithCurrency = BitfinexHttp.publicRequest<any>({
      url: 'https://api-pub.bitfinex.com/v2/tickers?symbols=ALL',
    })

    return rawMarketsWithCurrency

  }

  public static async list (): Promise<any[]> {

    const rawMarkets = await BitfinexMarketModule.listRaw()

    const parsedMarkets = {} as any

    return parsedMarkets

  }

  public static parse (params: {
    rawMarket: any,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const parsedMarket = {} as any

    return parsedMarket

  }

  public static parseMany (params: {
    rawMarkets: any[],
  }): IAlunaMarketSchema[] {

    const { rawMarkets } = params

    BitfinexLog.info('parsed 0 markets for Bitfinex')

    return {} as any

  }

}
