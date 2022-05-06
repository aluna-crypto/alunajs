import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const GATE_PRODUCTION_URL = 'https://api.gateio.ws/api/v4'



export const gateExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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
  {
    type: AlunaOrderTypesEnum.MARKET,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.READ,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.TRAILING_STOP,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.READ,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
]



export const gateBaseSpecs: IAlunaExchangeSchema = {
  id: 'gate',
  name: 'Gate',
  signupUrl: 'https://www.gate.io/signup',
  // TODO: Review 'connectApiUrl'
  connectApiUrl: 'https://www.gate.io/myaccount/apiv4keys',
  // TODO: Review exchange rates limits
  rateLimitingPerMinute: {
    perApiKey: 0,
    perIp: 0,
  },
  modes: {
    balance: AlunaFeaturesModeEnum.READ,
    order: AlunaFeaturesModeEnum.WRITE,
  },
  accounts: [
    // TODO: Review supported/implemented accounts
    {
      type: AlunaAccountEnum.EXCHANGE,
      supported: true,
      implemented: true,
      orderTypes: gateExchangeOrderTypes,
    },
    {
      type: AlunaAccountEnum.MARGIN,
      supported: false,
      implemented: false,
      orderTypes: [],
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: false,
      implemented: false,
      orderTypes: [],
    },
    {
      type: AlunaAccountEnum.LENDING,
      supported: false,
      implemented: false,
      orderTypes: [],
    },
  ],
  settings: {},
}



export const buildGateSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(gateBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  specs.settings = settings

  return specs

}



export const gateEndpoints = {
  symbol: {
    list: `${GATE_PRODUCTION_URL}/spot/currencies`,
  },
  market: {
    list: `${GATE_PRODUCTION_URL}/spot/tickers`,
  },
  key: {
    fetchDetails: `${GATE_PRODUCTION_URL}/spot/accounts`,
  },
  balance: {
    list: `${GATE_PRODUCTION_URL}/spot/accounts`,
  },
  order: {
    get: (id: string, query: string) => `${GATE_PRODUCTION_URL}/spot/orders/${id}?${query}`,
    list: `${GATE_PRODUCTION_URL}/spot/open_orders`,
    place: `${GATE_PRODUCTION_URL}/spot/orders`,
    cancel: (id: string, query: string) => `${GATE_PRODUCTION_URL}/spot/orders/${id}?${query}`,
    // edit: `${GATE_PRODUCTION_URL}/<desired-method>`,
  },
}
