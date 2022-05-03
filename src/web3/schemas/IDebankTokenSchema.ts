export interface IDebankTokenSchema {

  /* eslint-disable camelcase */
  id: string
  chain: string
  name: string
  symbol: string
  display_symbol?: null | string
  optimized_symbol: string
  decimals: number
  logo_url: string
  protocol_id: string
  price: number
  is_verified: boolean
  is_core: boolean
  is_wallet: boolean
  time_at: number
  amount: number
  raw_amount: number
  raw_amount_hex_str: string
  /* eslint-disable camelcase */

}
