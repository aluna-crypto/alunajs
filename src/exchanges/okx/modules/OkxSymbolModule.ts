import {
  each,
  values,
} from 'lodash'

import {
  IAlunaSymbolListRawReturns,
  IAlunaSymbolListReturns,
  IAlunaSymbolModule,
  IAlunaSymbolParseManyReturns,
  IAlunaSymbolParseReturns,
} from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { OkxSymbolStatusEnum } from '../enums/OkxSymbolStatusEnum'
import { OkxSymbolTypeEnum } from '../enums/OkxSymbolTypeEnum'
import { fetchOkxInstruments } from '../helpers/FetchOkxInstruments'
import { Okx } from '../Okx'
import { OkxLog } from '../OkxLog'
import { IOkxSymbolSchema } from '../schemas/IOkxSymbolSchema'



export const OkxSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await OkxSymbolModule.listRaw()

    const {
      symbols: parsedSymbols,
      requestCount: parseManyCount,
    } = OkxSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount
      + parseManyCount
      + listRawCount

    return {
      symbols: parsedSymbols,
      requestCount: totalRequestCount,
    }

  }



  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IOkxSymbolSchema>> {

    OkxLog.info('fetching Okx symbols')

    const {
      rawSymbols: rawSpotSymbols,
      requestCount: spotRequestCount,
    } = await fetchOkxInstruments({
      type: OkxSymbolTypeEnum.SPOT,
    })

    const {
      rawSymbols: rawMarginSymbols,
      requestCount: marginRequestCount,
    } = await fetchOkxInstruments({
      type: OkxSymbolTypeEnum.MARGIN,
    })

    const rawSymbols = [...rawSpotSymbols, ...rawMarginSymbols]

    const totalRequestCount = spotRequestCount + marginRequestCount

    return {
      rawSymbols,
      requestCount: totalRequestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IOkxSymbolSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const requestCount = 0

    const {
      baseCcy,
    } = rawSymbol

    const symbolMappings = Okx.settings.mappings

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCcy,
      symbolMappings,
    })

    const alias = id !== baseCcy
      ? baseCcy
      : undefined

    const parsedSymbol: IAlunaSymbolSchema = {
      id,
      exchangeId: Okx.ID,
      alias,
      meta: rawSymbol,
    }

    return {
      symbol: parsedSymbol,
      requestCount,
    }

  }



  public static parseMany (params: {
    rawSymbols: IOkxSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let requestCount = 0

    const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

    const filteredRawActiveSymbols = rawSymbols.filter(
      (rawSymbol) => rawSymbol.state !== OkxSymbolStatusEnum.SUSPEND,
    )

    each(filteredRawActiveSymbols, (symbolPair) => {

      const {
        baseCcy,
        quoteCcy,
      } = symbolPair

      if (!parsedSymbolsDict[baseCcy]) {

        const {
          symbol: parsedBaseSymbol,
          requestCount: parseCount,
        } = this.parse({ rawSymbol: symbolPair })

        requestCount += parseCount

        parsedSymbolsDict[baseCcy] = parsedBaseSymbol

      }

      if (!parsedSymbolsDict[quoteCcy]) {

        const {
          symbol: parsedQuoteSymbol,
          requestCount: parseCount,
        } = this.parse({
          rawSymbol: {
            ...symbolPair,
            baseCcy: symbolPair.quoteCcy,
          },
        })

        requestCount += parseCount

        parsedSymbolsDict[quoteCcy] = parsedQuoteSymbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDict)

    OkxLog.info(`parsed ${parsedSymbols.length} symbols for Okx`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
