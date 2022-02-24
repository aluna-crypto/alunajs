import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { IAlunaPositionSchema } from '../../../../lib/schemas/IAlunaPositionSchema'
import { PoloniexPositionSideEnum } from '../../enums/PoloniexPositionSideEnum'
import {
  IPoloniexPositionSchema,
  IPoloniexPositionWithCurrency,
} from '../../schemas/IPoloniexPositionSchema'



export const POLONIEX_RAW_POSITION_WITH_CURRENCY
  : IPoloniexPositionWithCurrency = {
    amount: '40.94717831',
    total: '-0.09671314',
    basePrice: '0.00236190',
    liquidationPrice: -1,
    pl: '-0.00058655',
    lendingFees: '-0.00000038',
    type: PoloniexPositionSideEnum.LONG,
    baseCurrency: 'BTC',
    quoteCurrency: 'ETH',
    currencyPair: 'BTC_ETH',
  }

export const POLONIEX_RAW_POSITIONS
  : IPoloniexPositionSchema = {
    BTC_ETH: {
      amount: '40.94717831',
      total: '-0.09671314',
      basePrice: '0.00236190',
      liquidationPrice: -1,
      pl: '-0.00058655',
      lendingFees: '-0.00000038',
      type: PoloniexPositionSideEnum.LONG,
    },
  }

export const POLONIEX_PARSED_POSITIONS: IAlunaPositionSchema[] = [
  {
    id: 'BTC_ETH',
    symbolPair: 'BTC_ETH',
    exchangeId: 'poloniex',
    baseSymbolId: 'BTC',
    quoteSymbolId: 'ETH',
    total: -0.09671314,
    amount: 40.94717831,
    account: AlunaAccountEnum.MARGIN,
    status: AlunaPositionStatusEnum.OPEN,
    side: AlunaSideEnum.LONG,
    basePrice: 0.0023619,
    openPrice: 0.0023619,
    pl: -0.00058655,
    plPercentage: 0,
    liquidationPrice: -1,
    openedAt: new Date('2022-02-23T14:28:05.953Z'),
    meta: {},
  },
]
