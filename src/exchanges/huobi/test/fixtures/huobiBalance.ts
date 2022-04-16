import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import {
  HuobiAccountTypeEnum,
  IHuobiBalanceListSchema,
  IHuobiUserAccountSchema,
} from '../../schemas/IHuobiBalanceSchema'



export const HUOBI_RAW_BALANCES: IHuobiBalanceListSchema[] = [
  {
    currency: 'btc',
    type: 'trade',
    balance: '1500',
    'seq-num': '0',
  },
  {
    currency: 'eth',
    type: 'trade',
    balance: '39',
    'seq-num': '0',
  },
  {
    currency: 'bnb',
    type: 'trade',
    balance: '123',
    'seq-num': '0',
  },
  {
    currency: 'usdt',
    type: 'trade',
    balance: '0',
    'seq-num': '0',
  },
]

export const HUOBI_PARSED_BALANCES: IAlunaBalanceSchema[] = [
  {
    symbolId: 'btc',
    account: AlunaAccountEnum.EXCHANGE,
    available: 1500,
    total: 1500,
    meta: {},
  },
  {
    symbolId: 'eth',
    account: AlunaAccountEnum.EXCHANGE,
    available: 39,
    total: 39,
    meta: {},
  },
  {
    symbolId: 'bnb',
    account: AlunaAccountEnum.EXCHANGE,
    available: 123,
    total: 123,
    meta: {},
  },
]

export const HUOBI_RAW_ACCOUNTS: IHuobiUserAccountSchema[] = [
  {
    id: 123456,
    type: HuobiAccountTypeEnum.POINT,
    subtype: '',
    state: 'working',
  },
  {
    id: 1234567,
    type: HuobiAccountTypeEnum.SPOT,
    subtype: '',
    state: 'working',
  },
]
