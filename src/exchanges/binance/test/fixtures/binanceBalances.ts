import {
  IBinanceMarginBalanceSchema,
  IBinanceSpotBalanceSchema,
} from '../../schemas/IBinanceBalanceSchema'



export const BINANCE_RAW_SPOT_BALANCES: IBinanceSpotBalanceSchema[] = [
  {
    asset: 'BTC',
    free: '0.04400000',
    locked: '0.02200000',
  },
  {
    asset: 'LTC',
    free: '0.10000000',
    locked: '0.20000000',
  },
  {
    asset: 'ETH',
    free: '0.02200000',
    locked: '0.00000000',
  },
  {
    asset: 'USDT',
    free: '0.00000000',
    locked: '0.00000000',
  },
]



export const BINANCE_RAW_MARGIN_BALANCES: IBinanceMarginBalanceSchema[] = [
  {
    asset: 'BTC',
    free: '12',
    locked: '0',
    borrowed: '0',
    interest: '0',
    netAsset: '12',
  },
  {
    asset: 'ETH',
    free: '0.04400000',
    locked: '0',
    borrowed: '0',
    interest: '0',
    netAsset: '12',
  },
  {
    asset: 'USDT',
    free: '5',
    locked: '0',
    borrowed: '0',
    interest: '0',
    netAsset: '100',
  },
]

