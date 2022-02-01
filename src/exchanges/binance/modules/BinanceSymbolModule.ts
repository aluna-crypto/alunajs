import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { Binance } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
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

    const rawSymbols = await BinanceHttp
      .publicRequest<IBinanceSymbolResponseSchema>({
        url: `${PROD_BINANCE_URL}/api/v3/exchangeInfo`,
      })

    const { symbols } = rawSymbols

    return symbols

  }



  public static parse (params:{
    rawSymbol: IBinanceSymbolSchema,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      baseAsset,
    } = rawSymbol

    const parsedSymbol = {
      id: baseAsset,
      exchangeId: Binance.ID,
      meta: rawSymbol,
    }

    return parsedSymbol

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
