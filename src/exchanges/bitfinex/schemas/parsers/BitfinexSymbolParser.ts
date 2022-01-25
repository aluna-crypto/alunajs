import { IAlunaSymbolSchema } from '../../../..'
import { Bitfinex } from '../../Bitfinex'
import {
  TBitfinexCurrencyLabel,
  TBitfinexCurrencySym,
} from '../IBitfinexSymbolSchema'



export class BitfinexSymbolParser {

  static parse (params: {
    bitfinexCurrency: string,
    bitfinexCurrencyLabel: TBitfinexCurrencyLabel | undefined,
    bitfinexSym: TBitfinexCurrencySym | undefined,
  }) {

    const {
      bitfinexCurrency,
      bitfinexCurrencyLabel,
      bitfinexSym,
    } = params


    let id = bitfinexCurrency

    let name: string | undefined
    let alias: string | undefined


    if (bitfinexCurrencyLabel) {

      [, name] = bitfinexCurrencyLabel

    }

    if (bitfinexSym) {

      [, id] = bitfinexSym

      alias = bitfinexCurrency

    }

    const symbol: IAlunaSymbolSchema = {
      id: id.toUpperCase(), // some symbols ids are like: 'USDt'
      name,
      exchangeId: Bitfinex.ID,
      alias,
      meta: {
        currency: bitfinexCurrency,
        currencyLabel: bitfinexCurrencyLabel,
        currencySym: bitfinexSym,
      },
    }

    return symbol

  }

}
