import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { IGateIOSymbolSchema } from '../../../schemas/IGateIOSymbolSchema'



export const GATEIO_RAW_SYMBOLS: IGateIOSymbolSchema[] = [
  {
    currency: 'ETH',
    delisted: false,
    withdraw_disabled: false,
    withdraw_delayed: false,
    deposit_disabled: false,
    trade_disabled: false,
  },
  {
    currency: 'BTC',
    delisted: false,
    withdraw_disabled: false,
    withdraw_delayed: false,
    deposit_disabled: false,
    trade_disabled: false,
  },
  {
    currency: 'ADA',
    delisted: false,
    withdraw_disabled: false,
    withdraw_delayed: false,
    deposit_disabled: false,
    trade_disabled: false,
  },
]



export const GATEIO_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    id: 'ETH',
  },
  {
    id: 'BTC',
  },
  {
    id: 'ADA',
  },
]
