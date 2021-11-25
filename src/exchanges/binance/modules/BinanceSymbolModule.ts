import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { Binance } from '../Binance'
// import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'



export const BinanceSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BinanceSymbolModule.listRaw()

    const parsedSymbols = BinanceSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }

  public static listRaw (): Promise<any[]> { // @TODO -> update any

    BinanceLog.info('fetching Binance symbols')

    // const rawSymbols = BinanceHttp.publicRequest<any[]>({ // @TODO -> update any
    //   url: DEV_BINANCE_URL + '/v1/public/currencies',
    // })

    return Promise.resolve([]) // @TODO -> update

  }



  public static parse (params:{
    rawSymbol: any, // @TODO -> update any
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      longName,
      shortName,
    } = rawSymbol

    return {
      id: shortName,
      name: longName,
      exchangeId: Binance.ID,
      meta: rawSymbol,
    }

  }



  public static parseMany (params: {
    rawSymbols: any[], // @TODO -> update any
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbols = rawSymbols.map((rawSymbol) => {

      const parsedSymbol = BinanceSymbolModule.parse({ rawSymbol })

      return parsedSymbol

    })

    BinanceLog.info(`parsed ${parsedSymbols.length} symbols for Binance`)

    return parsedSymbols

  }

}
