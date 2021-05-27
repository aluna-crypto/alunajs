import { AccountEnum } from '@lib/enums/AccountEnum'
import { OrderTypesEnum } from '@lib/enums/OrderTypeEnum'
import {
  IAlunaExchangeSpecsSchema,
  IOrderTypesSpecs,
} from '@lib/schemas/IAlunaExchangeSpecsSchema'



const exchangeOrderTypeSpecs: IOrderTypesSpecs = {
  [OrderTypesEnum.LIMIT]: {
    supported: true,
    implemented: true,
    options: {
      rate: 1,
      amount: 1,
    }
  }
}

export const ValrSpecs: IAlunaExchangeSpecsSchema = {
  acceptFloatAmounts: true,
  accounts: {
    [AccountEnum.EXCHANGE]: {
      supported: true,
      implemented: true,
      orderTypesSpecs: exchangeOrderTypeSpecs,
    },
    [AccountEnum.MARGIN]: {
      supported: false,
      implemented: false,
      // orderTypesSpecs: {},
    },
    [AccountEnum.DERIVATIVES]: {
      supported: false,
      implemented: false,
      // orderTypesSpecs: {},
    },
  }
}
