import {
  IAlunaInstrumentSchema,
} from './IAlunaInstrumentSchema'
import {
  IAlunaTickerSchema,
} from './IAlunaTickerSchema'



export interface IAlunaMarketSchema {
  pairSymbol: string
  ticker: IAlunaTickerSchema

  spotEnabled: boolean
  marginEnabled: boolean
  derivativesEnabled: boolean

  instrument?: IAlunaInstrumentSchema
  maxLeverage?: number
  leverageEnabled?: boolean
}
