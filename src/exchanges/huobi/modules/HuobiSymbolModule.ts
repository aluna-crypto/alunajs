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
import { HuobiSymbolStatusEnum } from '../enums/HuobiSymbolStatusEnum'
import { Huobi } from '../Huobi'
import { HuobiHttp } from '../HuobiHttp'
import { HuobiLog } from '../HuobiLog'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import { IHuobiSymbolSchema } from '../schemas/IHuobiSymbolSchema'



export const HuobiSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolListReturns> {

    const requestCount = 0

    const {
      rawSymbols,
      requestCount: listRawCount,
    } = await HuobiSymbolModule.listRaw()

    const {
      symbols: parsedSymbols,
      requestCount: parseManyCount,
    } = HuobiSymbolModule.parseMany({ rawSymbols })

    const totalRequestCount = requestCount
      + parseManyCount
      + listRawCount

    return {
      symbols: parsedSymbols,
      requestCount: totalRequestCount,
    }

  }



  public static async listRaw ()
    : Promise<IAlunaSymbolListRawReturns<IHuobiSymbolSchema>> {

    HuobiLog.info('fetching Huobi symbols')

    const { publicRequest } = HuobiHttp

    const {
      data: rawSymbols,
      requestCount,
    } = await publicRequest<IHuobiSymbolSchema[]>({
      url: `${PROD_HUOBI_URL}/v1/settings/common/market-symbols`,
    })

    return {
      rawSymbols,
      requestCount,
    }

  }



  public static parse (params:{
    rawSymbol: IHuobiSymbolSchema,
  }): IAlunaSymbolParseReturns {

    const { rawSymbol } = params

    const requestCount = 0

    const {
      bc: baseCurrency,
    } = rawSymbol

    const symbolMappings = Huobi.settings.mappings

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings,
    })

    const alias = id !== baseCurrency
      ? baseCurrency
      : undefined

    const parsedSymbol: IAlunaSymbolSchema = {
      id,
      exchangeId: Huobi.ID,
      alias,
      meta: rawSymbol,
    }

    return {
      symbol: parsedSymbol,
      requestCount,
    }

  }



  public static parseMany (params: {
    rawSymbols: IHuobiSymbolSchema[],
  }): IAlunaSymbolParseManyReturns {

    const { rawSymbols } = params

    let requestCount = 0

    const parsedSymbolsDict: Record<string, IAlunaSymbolSchema> = {}

    const filteredActiveSymbols = rawSymbols.filter(
      (rawSymbol) => rawSymbol.state === HuobiSymbolStatusEnum.ONLINE,
    )

    each(filteredActiveSymbols, (symbolPair) => {

      const {
        bc: baseCurrency,
        qc: quoteCurrency,
      } = symbolPair

      if (!parsedSymbolsDict[baseCurrency]) {

        const {
          symbol: parsedBaseSymbol,
          requestCount: parseCount,
        } = this.parse({ rawSymbol: symbolPair })

        requestCount += parseCount

        parsedSymbolsDict[baseCurrency] = parsedBaseSymbol

      }

      if (!parsedSymbolsDict[quoteCurrency]) {

        const {
          symbol: parsedQuoteSymbol,
          requestCount: parseCount,
        } = this.parse({
          rawSymbol: {
            ...symbolPair,
            bc: quoteCurrency,
          },
        })

        requestCount += parseCount

        parsedSymbolsDict[quoteCurrency] = parsedQuoteSymbol

      }

    })

    const parsedSymbols = values(parsedSymbolsDict)

    HuobiLog.info(`parsed ${parsedSymbols.length} symbols for Huobi`)

    return {
      symbols: parsedSymbols,
      requestCount,
    }

  }

}
