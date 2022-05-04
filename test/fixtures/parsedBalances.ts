import { AlunaWalletEnum } from '../../src/lib/enums/AlunaWalletEnum'
import { IAlunaBalanceSchema } from '../../src/lib/schemas/IAlunaBalanceSchema'



export const PARSED_BALANCES: IAlunaBalanceSchema[] = [
  {
    symbolId: 'BTC',
    wallet: AlunaWalletEnum.EXCHANGE,
    available: 1500,
    total: 1500,
    meta: {},
  },
  {
    symbolId: 'ETH',
    wallet: AlunaWalletEnum.EXCHANGE,
    available: 32,
    total: 32,
    meta: {},
  },
  {
    symbolId: 'LTC',
    wallet: AlunaWalletEnum.EXCHANGE,
    available: 11,
    total: 11,
    meta: {},
  },
]
