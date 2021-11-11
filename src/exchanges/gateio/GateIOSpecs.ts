import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaExchangeOrderTypesSpecsSchema,
  IAlunaExchangeSpecsSchema,
} from '../../lib/schemas/IAlunaExchangeSpecsSchema'



const exchangeOrderTypes: IAlunaExchangeOrderTypesSpecsSchema = {
  // TODO implement me

  [AlunaOrderTypesEnum.LIMIT]: {
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.READ,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  [AlunaOrderTypesEnum.MARKET]: {
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.READ,
    options: {
      rate: 1,
      amount: 1,
    },
  },
}

export const GateIOSpecs: IAlunaExchangeSpecsSchema = {
  id: 'GateIO',
  acceptFloatAmounts: true,
  features: {
    balance: AlunaFeaturesModeEnum.READ,
    order: AlunaFeaturesModeEnum.READ,
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
