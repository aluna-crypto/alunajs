import { IAlunaInstrumentSchema } from './IAlunaInstrumentSchema'
import { IAlunaTickerSchema } from './IAlunaTickerSchema'



export interface IAlunaMarketSchema {

  exchangeId: string

  symbolPair: string

  baseSymbolId: string
  quoteSymbolId: string

  ticker: IAlunaTickerSchema

  minTradeAmount?: number
  maxTradeAmount?: number

  spotEnabled: boolean
  marginEnabled: boolean
  derivativesEnabled: boolean

  instrument?: IAlunaInstrumentSchema
  maxLeverage?: number
  leverageEnabled: boolean

  meta: any

}
