import { cloneDeep } from 'lodash'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaExchangeErrorCodes } from '../../lib/errors/AlunaExchangeErrorCodes'
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


export const getGateEndpoints = (settings: IAlunaSettingsSchema) => {

  const baseUrl = GATE_PRODUCTION_URL

  if (settings.useTestNet) {
    throw new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET,
      message: 'Gate don\'t have a testnet.',
    })
  }

  return {
    symbol: {
      list: `${baseUrl}/spot/currencies`,
    },
    market: {
      list: `${baseUrl}/spot/tickers`,
    },
    key: {
      fetchDetails: `${baseUrl}/spot/accounts`,
    },
    balance: {
      list: `${baseUrl}/spot/accounts`,
    },
    order: {
      get: (id: string, query: string) => `${baseUrl}/spot/orders/${id}?${query}`,
      list: `${baseUrl}/spot/open_orders`,
      place: `${baseUrl}/spot/orders`,
      cancel: (id: string, query: string) => `${baseUrl}/spot/orders/${id}?${query}`,
      // edit: `${baseUrl}/<desired-method>`,
    },
  }
}
