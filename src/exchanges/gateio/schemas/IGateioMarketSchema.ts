import { IGateioCurrencyPairs } from './IGateioCurrencyPair'



export interface IGateioMarketSchema extends IGateioCurrencyPairs {
  ticker: IGateioTickerSchema
}

export interface IGateioTickerSchema {
  currency_pair: string
  last: string
  lowest_ask: string
  highest_bid: string
  change_percentage: string
  base_volume: string
  quote_volume: string
  high_24h: string
  low_24h: string
  etf_net_value: string
  etf_pre_net_value: string
  etf_pre_timestamp: number
  etf_leverage: string
}
