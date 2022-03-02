import {
  each,
  values,
} from 'lodash'

import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Binance } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import { IBinanceInfoSchema } from '../schemas/IBinanceInfoSchemas'
import { IBinanceSymbolSchema } from '../schemas/IBinanceSymbolSchema'



export const BinanceSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BinanceSymbolModule.listRaw()

    const parsedSymbols = BinanceSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }



  public static async listRaw (): Promise<IBinanceSymbolSchema[]> {

    BinanceLog.info('fetching Binance symbols')

    const { publicRequest } = BinanceHttp

    const { symbols } = await publicRequest<IBinanceInfoSchema>({
      url: `${PROD_BINANCE_URL}/api/v3/exchangeInfo`,
    })

    return symbols

  }



  public static parse (params:{
    rawSymbol: IBinanceSymbolSchema,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      baseAsset,
    } = rawSymbol

    const symbolMappings = Binance.settings.mappings

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseAsset,
      symbolMappings,
    })

    const alias = id !== baseAsset
      ? baseAsset
      : undefined

    const parsedSymbol: IAlunaSymbolSchema = {
      id,
      exchangeId: Binance.ID,
      alias,
      meta: rawSymbol,
    }

    return parsedSymbol

  }



  public static parseMany (params: {
    rawSymbols: IBinanceSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

    each(rawSymbols, (symbolPair) => {

      const {
        baseAsset,
        quoteAsset,
      } = symbolPair

      if (!parsedSymbolsDict[baseAsset]) {

        const parsedBaseSymbol = this.parse({ rawSymbol: symbolPair })

        parsedSymbolsDict[baseAsset] = parsedBaseSymbol

      }

      if (!parsedSymbolsDict[quoteAsset]) {

        const parsedQuoteSymbol = this.parse({
          rawSymbol: {
            ...symbolPair,
            baseAsset: symbolPair.quoteAsset,
          },
        })

        parsedSymbolsDict[quoteAsset] = parsedQuoteSymbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDict)

    BinanceLog.info(`parsed ${parsedSymbols.length} symbols for Binance`)

    return parsedSymbols

  }

}
