import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import { IFtxBalanceSchema } from '../../schemas/IFtxBalanceSchema'



export const FTX_RAW_BALANCES: IFtxBalanceSchema[] = [
  {
    coin: 'USD',
    total: 3,
    free: 3,
    availableWithoutBorrow: 3,
    usdValue: 3,
    spotBorrow: 0,
  },
  {
    coin: 'USDT',
    total: 12,
    free: 12,
    availableWithoutBorrow: 12,
    usdValue: 12,
    spotBorrow: 0,
  },
  {
    coin: 'BNB',
    total: 4,
    free: 2,
    availableWithoutBorrow: 2,
    usdValue: 2,
    spotBorrow: 0,
  },
  {
    coin: 'BTC',
    total: 0,
    free: 0,
    availableWithoutBorrow: 0,
    usdValue: 0,
    spotBorrow: 0,
  },
]

export const FTX_PARSED_BALANCES: IAlunaBalanceSchema[] = [
  {
    symbolId: 'USD',
    account: AlunaAccountEnum.EXCHANGE,
    available: 3,
    total: 3,
    meta: {},
  },
  {
    symbolId: 'USDT',
    account: AlunaAccountEnum.EXCHANGE,
    available: 12,
    total: 12,
    meta: {},
  },
  {
    symbolId: 'BNB',
    account: AlunaAccountEnum.EXCHANGE,
    available: 2,
    total: 4,
    meta: {},
  },
]
