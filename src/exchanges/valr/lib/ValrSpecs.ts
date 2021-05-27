import { AccountEnum } from '@lib/enums/AccountEnum'
import { OrderTypesEnum } from '@lib/enums/OrderTypeEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSpecsSchema,
} from '@lib/schemas/IAlunaExchangeSpecsSchema'



const exchangeOrderSpecs: IAlunaExchangeOrderSpecsSchema[] = [{
  enabled: true,
  supported: true,
  type: OrderTypesEnum.LIMIT,
  options: {
    rate: 1,
    amount: 1,
  }
}]

export const ValrSpecs: IAlunaExchangeSpecsSchema = {
  acceptFloatAmounts: true,
  accounts: {
    [AccountEnum.EXCHANGE]: {
      enabled: true,
      supported: true,
      orderSpecs: exchangeOrderSpecs,
    },
    [AccountEnum.MARGIN]: {
      enabled: false,
      supported: false,
      orderSpecs: [],
    },
    [AccountEnum.DERIVATIVES]: {
      enabled: false,
      supported: false,
      orderSpecs: [],
    },
  }
}
