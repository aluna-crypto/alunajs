import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



// TODO: Review exchange API url
export const BITFINEX_AUTHED_URL = 'https://api.bitfinex.com/v2'
export const BITFINEX_PUBLIC_URL = 'https://api-pub.bitfinex.com/v2'



export const bitfinexExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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



export const bitfinexBaseSpecs: IAlunaExchangeSchema = {
  id: 'bitfinex',
  name: 'Bitfinex',
  // TODO: Review 'signupUrl'
  signupUrl: 'https://bitfinex.com/account/register',
  // TODO: Review 'connectApiUrl'
  connectApiUrl: 'https://bitfinex.com/manage?view=api',
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
      orderTypes: bitfinexExchangeOrderTypes,
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



export const buildBitfinexSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(bitfinexBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  specs.settings = settings

  return specs

}



export const bitfinexEndpoints = {
  symbol: {
    // get: `${BITFINEX_PRODUCTION_PUBLIC_URL}/<desired-method>`,
    list: `${BITFINEX_PUBLIC_URL}/conf/pub:list:currency,pub:map:currency:label`,
  },
  market: {
    // get: `${BITFINEX_PRODUCTION_PUBLIC_URL}/<desired-method>`,
    list: `${BITFINEX_PUBLIC_URL}/<desired-method>`,
  },
  key: {
    fetchDetails: `${BITFINEX_PUBLIC_URL}/<desired-method>`,
  },
  balance: {
    list: `${BITFINEX_PUBLIC_URL}/<desired-method>`,
  },
  order: {
    get: (id: string) => `${BITFINEX_PUBLIC_URL}/<desired-method>/${id}`,
    list: `${BITFINEX_PUBLIC_URL}/<desired-method>`,
    place: `${BITFINEX_PUBLIC_URL}/<desired-method>`,
    cancel: (id: string) => `${BITFINEX_PUBLIC_URL}/<desired-method>/${id}`,
    // edit: `${BITFINEX_PRODUCTION_PUBLIC_URL}/<desired-method>`,
  },
}
