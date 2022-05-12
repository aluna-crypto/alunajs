import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



// TODO: set proper urls
export const BITMEX_PRODUCTION_URL = 'https://www.bitmex.com/api/v1'
export const BITMEX_TESTNET_URL = 'https://testnet.bitmex.com/api/v1'



export const bitmexExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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



export const bitmexBaseSpecs: IAlunaExchangeSchema = {
  id: 'bitmex',
  name: 'Bitmex',
  // TODO: Review 'signupUrl'
  signupUrl: 'https://bitmex.com/account/register',
  // TODO: Review 'connectApiUrl'
  connectApiUrl: 'https://bitmex.com/manage?view=api',
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
      orderTypes: bitmexExchangeOrderTypes,
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



export const buildBitmexSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(bitmexBaseSpecs)

  if (referralCode) {
    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`
  }

  specs.settings = settings

  return specs

}


export const getBitmexEndpoints = (
  settings: IAlunaSettingsSchema,
) => {

  let baseUrl = BITMEX_PRODUCTION_URL

  if (settings.useTestNet) {
    baseUrl = BITMEX_TESTNET_URL
  }

  return {
    symbol: {
      list: `${baseUrl}/instrument/active`,
    },
    market: {
      get: (symbolPair: string) => `${baseUrl}/instrument?symbol=${symbolPair}`,
      list: `${baseUrl}/instrument/active`,
    },
    key: {
      fetchDetails: `${baseUrl}/apiKey`,
    },
    balance: {
      assets: `${baseUrl}/user/margin`,
      assetsDetails: `${baseUrl}/wallet/assets`,
    },
    order: {
      get: `${baseUrl}/order`,
      list: `${baseUrl}/order`,
      place: `${baseUrl}/order`,
      cancel: `${baseUrl}/order`,
      edit: `${baseUrl}/order`,
    },
    position: {
      list: `${baseUrl}/<desired-method>`,
      get: `${baseUrl}/<desired-method>`,
      close: `${baseUrl}/<desired-method>`,
      getLeverage: `${baseUrl}/<desired-method>`,
      setLeverage: `${baseUrl}/<desired-method>`,
    },
  }
}
