import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaExchangeOrderTypesSpecsSchema,
  IAlunaExchangeSpecsSchema,
} from '../../lib/schemas/IAlunaExchangeSpecsSchema'



const exchangeOrderTypes: IAlunaExchangeOrderTypesSpecsSchema = {
  [AlunaOrderTypesEnum.LIMIT]: {
    supported: true,
    implemented: true,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  [AlunaOrderTypesEnum.MARKET]: {
    supported: true,
    implemented: true,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  [AlunaOrderTypesEnum.STOP_LIMIT]: {
    supported: true,
    implemented: true,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
  [AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT]: {
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
    balance: AlunaFeaturesModeEnum.READ,
    order: AlunaFeaturesModeEnum.WRITE,
  },
  accounts: {
    [AlunaAccountEnum.EXCHANGE]: {
      supported: true,
      implemented: true,
      orderTypes: exchangeOrderTypes,
    },
    [AlunaAccountEnum.MARGIN]: {
      supported: false,
    },
    [AlunaAccountEnum.DERIVATIVES]: {
      supported: false,
    },
    [AlunaAccountEnum.LENDING]: {
      supported: false,
    },
  },
}
