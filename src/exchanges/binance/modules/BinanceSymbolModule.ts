import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import {
  Binance,
  PROD_BINANCE_URL,
} from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import {
  IBinanceSymbolInfoSchema,
  IBinanceSymbolSchema,
} from '../schemas/IBinanceSymbolSchema'



export const BinanceSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BinanceSymbolModule.listRaw()

    const parsedSymbols = BinanceSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }

  public static listRaw (): Promise<IBinanceSymbolInfoSchema[]> {

    BinanceLog.info('fetching Binance symbols')

    const rawSymbols = BinanceHttp.publicRequest<IBinanceSymbolSchema>({
      url: PROD_BINANCE_URL + '/api/v3/exchangeInfo',
    }).then(res => res.symbols);

    return rawSymbols

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
