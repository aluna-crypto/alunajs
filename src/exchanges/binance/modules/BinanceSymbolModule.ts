import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import {
  Binance,
  PROD_BINANCE_URL,
} from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import {
  IBinanceSymbolResponseSchema,
  IBinanceSymbolSchema,
} from '../schemas/IBinanceSymbolSchema'



export const BinanceSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BinanceSymbolModule.listRaw()

    const parsedSymbols = BinanceSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }

  public static async listRaw (): Promise<IBinanceSymbolSchema[]> {

    BinanceLog.info('fetching Binance symbols')

    const rawSymbols = 
      await BinanceHttp.publicRequest<IBinanceSymbolResponseSchema>({
        url: PROD_BINANCE_URL + '/api/v3/exchangeInfo',
      })

    return rawSymbols.symbols

  }



  public static parse (params:{
    rawSymbol: IBinanceSymbolSchema,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      baseAsset,
    } = rawSymbol

    return {
      id: baseAsset,
      exchangeId: Binance.ID,
      meta: rawSymbol,
    }

  }



  public static parseMany (params: {
    rawSymbols: IBinanceSymbolSchema[],
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
