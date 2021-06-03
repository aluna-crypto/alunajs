import { AccountEnum } from '../../../../../lib/enums/AccountEnum'
import { IAlunaBalanceSchema } from '../../../../../lib/schemas/IAlunaBalanceSchema'
import { IValrBalanceSchema } from '../../../schemas/IValrBalanceSchema'



export const VALR_RAW_BALANCES: IValrBalanceSchema[] = [
  {
    currency: 'BTC',
    available: '0.044511644725',
    reserved: '0.01',
    total: '0.054511644725',
    updatedAt: '2020-05-31T05:02:18.186Z',
  },
  {
    currency: 'ETH',
    available: '0.01626594758',
    reserved: '0.49',
    total: '0.50626594758',
    updatedAt: '2020-05-31T05:10:16.522Z',
  },
  {
    currency: 'LTC',
    available: '1.57270565',
    reserved: '0',
    total: '1.57270565',
    updatedAt: '2020-05-11T18:42:17.953Z',
  },
  /**
   * balances with total 0 are ignored when parsing balances
   */
  {
    currency: 'CRO',
    available: '0',
    reserved: '0',
    total: '0',
  },
  {
    currency: 'USDT',
    available: '0',
    reserved: '0',
    total: '0',
  },
]



export const VALR_PARSED_BALANCES: IAlunaBalanceSchema[] = [
  {
    symbolId: 'ETH',
    account: AccountEnum.EXCHANGE,
    available: 0.04928793877,
    total: 0.04928793877,
  },
  {
    symbolId: 'ZAR',
    account: AccountEnum.EXCHANGE,
    available: 74.24437545,
    total: 74.24437545,
  },
  {
    symbolId: 'BTC',
    account: AccountEnum.EXCHANGE,
    available: 0.000012197825,
    total: 0.000012197825,
  },
  {
    symbolId: 'XRP',
    account: AccountEnum.EXCHANGE,
    available: 0.533568,
    total: 0.533568,
  },
]

