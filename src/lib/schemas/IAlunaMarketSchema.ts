import { IAlunaInstrumentSchema } from './IAlunaInstrumentSchema'
import { IAlunaTickerSchema } from './IAlunaTickerSchema'



export interface IAlunaMarketSchema {

  exchangeId: string

  pairSymbol: string

  baseSymbolId: string
  quoteSymbolId: string

  ticker: IAlunaTickerSchema

  spotEnabled: boolean
  marginEnabled: boolean
  derivativesEnabled: boolean

  instrument?: IAlunaInstrumentSchema
  maxLeverage?: number
  leverageEnabled: boolean

}
