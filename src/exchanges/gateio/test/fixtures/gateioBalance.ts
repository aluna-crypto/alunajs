import {
  AlunaAccountEnum,
  IAlunaBalanceSchema,
} from '../../../..'
import { IGateioBalanceSchema } from '../../schemas/IGateioBalanceSchema'



export const GATEIO_RAW_BALANCES: IGateioBalanceSchema[] = [
  {
    currency: 'BNB',
    available: '15',
    locked: '0',
  },
  {
    currency: 'BTC',
    available: '3',
    locked: '4',
  },
  {
    currency: 'ETH',
    available: '5.54',
    locked: '3',
  },
  {
    currency: 'USDT',
    available: '0',
    locked: '0',
  },
]

export const GATEIO_PARSED_BALANCES: IAlunaBalanceSchema[] = [
  {
    symbolId: 'BNB',
    account: AlunaAccountEnum.EXCHANGE,
    available: 15,
    total: 15,
    meta: {},
  },
  {
    symbolId: 'BTC',
    account: AlunaAccountEnum.EXCHANGE,
    available: 3,
    total: 7,
    meta: {},
  },
  {
    symbolId: 'ETH',
    account: AlunaAccountEnum.EXCHANGE,
    available: 5.54,
    total: 8.54,
    meta: {},
  },
]

