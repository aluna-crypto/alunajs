import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../index'
import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'



export const PROD_GATEIO_URL = 'https://api.gateio.com'
export const DEV_GATEIO_URL = 'https://testnet.gateio.vision'

export const exchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
  {
    type: AlunaOrderTypesEnum.LIMIT,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
    },
  },
]

export const GATEIOSpecs: IAlunaExchangeSchema = {
  id: 'gateio',
  name: 'GateIO',
  signupUrl: 'https://www.gate.io/signup',
  connectApiUrl: 'https://www.gate.io/myaccount/apiv4keys',
  rateLimitingPerMinute: {
    perApiKey: 300,
    perIp: 300,
  },
  modes: {
    balance: AlunaFeaturesModeEnum.READ,
    order: AlunaFeaturesModeEnum.WRITE,
  },
  accounts: [
    {
      type: AlunaAccountEnum.EXCHANGE,
      supported: true,
      implemented: true,
      orderTypes: exchangeOrderTypes,
    },
    {
      type: AlunaAccountEnum.MARGIN,
      supported: true,
      implemented: false,
      orderTypes: [],
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: true,
      implemented: false,
      orderTypes: [],
    },
    {
      type: AlunaAccountEnum.LENDING,
      supported: false,
      orderTypes: [],
    },
  ],
}
