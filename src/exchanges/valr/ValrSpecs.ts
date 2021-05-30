import { AccountEnum } from '../../lib/enums/AccountEnum'
import { FeaturesModeEnum } from '../../lib/enums/FeaturesModeEnum'
import { OrderTypesEnum } from '../../lib/enums/OrderTypeEnum'
import {
  IAlunaExchangeOrderTypesSpecsSchema, IAlunaExchangeSpecsSchema,
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
}

export const ValrSpecs: IAlunaExchangeSpecsSchema = {
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
      supported: false, // unsupported
      implemented: false,
      // orderTypes: {},
    },
    [AccountEnum.DERIVATIVES]: {
      supported: false, // unsupported
      implemented: false,
      // orderTypes: {},
    },
  },
}
