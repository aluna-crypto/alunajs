import { AlunaAccountEnum } from '../../src/lib/enums/AlunaAccountEnum'
import { AlunaPositionSideEnum } from '../../src/lib/enums/AlunaPositionSideEnum'
import { AlunaPositionStatusEnum } from '../../src/lib/enums/AlunaPositionStatusEnum'
import { IAlunaPositionSchema } from '../../src/lib/schemas/IAlunaPositionSchema'



export const PARSED_POSITIONS: IAlunaPositionSchema[] = [
  {
    id: 151970561,
    symbolPair: 'tADAUSD',
    baseSymbolId: 'ADA',
    quoteSymbolId: 'USD',
    exchangeId: 'sample',
    total: 2.3286,
    amount: 2,
    account: 'margin' as AlunaAccountEnum,
    status: 'open' as AlunaPositionStatusEnum,
    side: 'long' as AlunaPositionSideEnum,
    basePrice: 1.1643,
    openPrice: 1.1643,
    pl: -0.006852799999999758,
    plPercentage: -0.09447736837583776,
    leverage: 0.07746639479288778,
    liquidationPrice: 0,
    openedAt: new Date('1970-01-20T00:49:49.292Z'),
    meta: {},
  },
  {
    id: 151970562,
    symbolPair: 'tETHBTC',
    baseSymbolId: 'ETH',
    quoteSymbolId: 'BTC',
    exchangeId: 'sample',
    total: 3.4928999999999997,
    amount: 3,
    account: 'margin'as AlunaAccountEnum,
    status: 'closed'as AlunaPositionStatusEnum,
    side: 'long'as AlunaPositionSideEnum,
    basePrice: 1.1643,
    openPrice: 1.1643,
    pl: -0.006852799999999758,
    plPercentage: -0.09447736837583776,
    leverage: 0.07746639479288778,
    liquidationPrice: 0,
    openedAt: new Date('1970-01-20T00:49:49.292Z'),
    meta: {},
  },
]
