import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitfinex } from '../../Bitfinex'
import { TBitfinexCurrencyLabel } from '../IBitfinexSymbolSchema'



interface ISplitSymbolPairResponse {
  baseSymbolId: string
  quoteSymbolId: string
}



export class BitfinexSymbolParser {

  static parse (params: {
    bitfinexCurrency: string,
    bitfinexCurrencyLabel: TBitfinexCurrencyLabel | undefined,
  }): IAlunaSymbolSchema {

    const {
      bitfinexCurrency,
      bitfinexCurrencyLabel,
    } = params

    const id = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: bitfinexCurrency,
      symbolMappings: Bitfinex.settings.mappings,
    })

    const alias = id !== bitfinexCurrency
      ? bitfinexCurrency
      : undefined

    let name: string | undefined

    if (bitfinexCurrencyLabel) {

      [, name] = bitfinexCurrencyLabel

    }

    const symbol: IAlunaSymbolSchema = {
      id,
      name,
      exchangeId: Bitfinex.ID,
      alias,
      meta: {
        currency: bitfinexCurrency,
        currencyLabel: bitfinexCurrencyLabel,
      },
    }

    return symbol

  }



  public static splitSymbolPair (params: {
    symbolPair: string,
  }): ISplitSymbolPairResponse {

    const { symbolPair } = params

    let baseSymbolId: string
    let quoteSymbolId: string

    const spliter = symbolPair.indexOf(':')

    if (spliter >= 0) {

      baseSymbolId = symbolPair.slice(1, spliter)
      quoteSymbolId = symbolPair.slice(spliter + 1)

    } else {

      baseSymbolId = symbolPair.slice(1, 4)
      quoteSymbolId = symbolPair.slice(4)

    }

    return {
      baseSymbolId,
      quoteSymbolId,
    }

  }

}
