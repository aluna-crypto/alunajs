import {
  each,
  values,
} from 'lodash'

import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { Bitmex } from '../Bitmex'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { BitmexSpecs } from '../BitmexSpecs'
import { IBitmexSymbolsSchema } from '../schemas/IBitmexSymbolsSchema'



export const BitmexSymbolModule: IAlunaSymbolModule = class {

  public static async listRaw (): Promise<IBitmexSymbolsSchema[]> {

    BitmexLog.info('fetching Bitmex symbols')

    const { publicRequest } = BitmexHttp

    const rawSymbols = await publicRequest<IBitmexSymbolsSchema[]>({
      url: `${BitmexSpecs.connectApiUrl}/instrument/active`,
    })

    return rawSymbols

  }



  public static async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await BitmexSymbolModule.listRaw()

    const parsedSymbols = BitmexSymbolModule.parseMany({ rawSymbols })

    return parsedSymbols

  }



  public static parse (params:{
    rawSymbol: IBitmexSymbolsSchema,
  }): IAlunaSymbolSchema {

    const { rawSymbol } = params

    const {
      rootSymbol,
    } = rawSymbol

    const parsedSymbol: IAlunaSymbolSchema = {
      id: rootSymbol,
      exchangeId: Bitmex.ID,
      meta: rawSymbol,
    }

    return parsedSymbol

  }



  public static parseMany (params: {
    rawSymbols: IBitmexSymbolsSchema[],
  }): IAlunaSymbolSchema[] {

    const { rawSymbols } = params

    const parsedSymbolsDictionary: Record<string, IAlunaSymbolSchema> = {}

    each(rawSymbols, (rawSymbol) => {

      const {
        rootSymbol,
        quoteCurrency,
      } = rawSymbol

      if (!parsedSymbolsDictionary[rootSymbol]) {

        parsedSymbolsDictionary[rootSymbol] = this.parse({ rawSymbol })

      }

      if (!parsedSymbolsDictionary[quoteCurrency]) {

        parsedSymbolsDictionary[quoteCurrency] = this.parse({
          rawSymbol: {
            ...rawSymbol,
            rootSymbol: quoteCurrency,
          },
        })

      }

    })

    const parsedSymbols = values(parsedSymbolsDictionary)

    BitmexLog.info(`parsed ${parsedSymbols.length} symbols for Bitmex`)

    return parsedSymbols

  }

}
