import { AccountEnum } from '../../lib/enums/AccountEnum'
import { FeaturesModeEnum } from '../../lib/enums/FeaturesModeEnum'
import { OrderTypesEnum } from '../../lib/enums/OrderTypeEnum'
import {
  IAlunaExchangeOrderTypesSpecsSchema,
  IAlunaExchangeSpecsSchema,
} from '../../lib/schemas/IAlunaExchangeSpecsSchema'



const exchangeOrderTypes: IAlunaExchangeOrderTypesSpecsSchema = {
  [OrderTypesEnum.LIMIT]: {
    supported: true,
    implemented: true,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  [OrderTypesEnum.MARKET]: {
    supported: true,
    implemented: true,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  [OrderTypesEnum.STOP_LIMIT]: {
    supported: true,
    implemented: true,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
  [OrderTypesEnum.TAKE_PROFIT_LIMIT]: {
    supported: true,
    implemented: true,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
}

export const ValrSpecs: IAlunaExchangeSpecsSchema = {
  id: 'valr',
  acceptFloatAmounts: true,
  features: {
    balance: FeaturesModeEnum.READ,
    order: FeaturesModeEnum.WRITE,
  },
  accounts: {
    [AccountEnum.EXCHANGE]: {
      supported: true,
      implemented: true,
      orderTypes: exchangeOrderTypes,
    },
    [AccountEnum.MARGIN]: {
      supported: false,
    },
    [AccountEnum.DERIVATIVES]: {
      supported: false,
    },
    [AccountEnum.LENDING]: {
      supported: false,
    },
  },
}
