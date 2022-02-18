import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import { Bitfinex } from '../../Bitfinex'
import { TBitfinexCurrencyLabel } from '../IBitfinexSymbolSchema'



export class BitfinexSymbolParser {

  static parse (params: {
    bitfinexCurrency: string,
    bitfinexCurrencyLabel: TBitfinexCurrencyLabel | undefined,
  }) {

    const {
      bitfinexCurrency,
      bitfinexCurrencyLabel,
    } = params

    const id = Bitfinex.mappings?.[bitfinexCurrency] || bitfinexCurrency

    let name: string | undefined
    let alias: string | undefined


    if (bitfinexCurrencyLabel) {

      [, name] = bitfinexCurrencyLabel

    }

    const symbol: IAlunaSymbolSchema = {
      id: id.toUpperCase(), // some symbols ids are like: 'USDt'
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

}
