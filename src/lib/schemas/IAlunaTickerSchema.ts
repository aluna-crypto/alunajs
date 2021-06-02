// TODO: trim interface down to what is essential
export interface IAlunaTickerSchema {
  high: number
  low: number
  bid: number
  ask: number
  last: number
  change: number
  date: Date
  baseVolume: number
  quoteVolume: number
}
