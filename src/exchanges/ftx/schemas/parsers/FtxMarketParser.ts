import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { Ftx } from '../../Ftx'
import { IFtxMarketSchema } from '../IFtxMarketSchema'



export class FtxMarketParser {

  static parse (params: {
    rawMarket: IFtxMarketSchema,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    const {
      ask,
      baseCurrency,
      bid,
      change24h,
      last,
      name,
      price,
      quoteCurrency,
      quoteVolume24h,
      volumeUsd24h,
    } = rawMarket

    const ticker = {
      high: price,
      low: price,
      bid,
      ask,
      last,
      date: new Date(),
      change: change24h,
      baseVolume: volumeUsd24h,
      quoteVolume: quoteVolume24h,
    }

    return {
      exchangeId: Ftx.ID,
      symbolPair: name,
      baseSymbolId: baseCurrency,
      quoteSymbolId: quoteCurrency,
      ticker,
      spotEnabled: true,
      marginEnabled: false,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

  }

}
