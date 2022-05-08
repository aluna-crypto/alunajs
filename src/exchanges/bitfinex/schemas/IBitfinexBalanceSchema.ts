import { BitfinexAccountsEnum } from '../enums/BitfinexAccountsEnum'



export interface IBitfinexBalanceSchema extends TBitfinexBalance {}

type TBitfinexBalance = [
  WALLET_TYPE: BitfinexAccountsEnum,
  CURRENCY: string,
  BALANCE: number,
  UNSETTLED_INTEREST: number,
  AVAILABLE_BALANCE: number,
  LAST_CHANGE: string | null,
  TRADE_DETAILS?: IBitfinexBalanceTradeDetails | null,
]

interface IBitfinexBalanceTradeDetails {

  /* eslint-disable camelcase */
  reason: string
  order_id: number
  order_id_oppo: number
  liq_stage?: number | null
  trade_price: string
  trade_amount: string
  order_cid: number | null
  order_gid: number | null
  /* eslint-enable camelcase */

}
