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



export const VALR_PRODUCTION_URL = 'https://api.valr.com/v1'



export const valrExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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



export const valrBaseSpecs: IAlunaExchangeSchema = {
  id: 'valr',
  name: 'Valr',
  // TODO: Review 'signupUrl'
  signupUrl: 'https://valr.com/account/register',
  // TODO: Review 'connectApiUrl'
  connectApiUrl: 'https://valr.com/manage?view=api',
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
      orderTypes: valrExchangeOrderTypes,
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



export const buildValrSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(valrBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  specs.settings = settings

  return specs

}



export const getValrEndpoints = (settings: IAlunaSettingsSchema) => {

  const baseUrl = VALR_PRODUCTION_URL

  if (settings.useTestNet) {
    throw new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET,
      message: 'Valr don\'t have a testnet.',
    })
  }

  return {
    symbol: {
      // get: `${baseUrl}/<desired-method>`,
      list: `${baseUrl}/public/currencies`,
    },
    market: {
      // get: `${baseUrl}/<desired-method>`,
      summaries: `${baseUrl}/public/marketsummary`,
      pairs: `${baseUrl}/public/pairs`,
    },
    key: {
      fetchDetails: `${baseUrl}/account/api-keys/current`,
    },
    balance: {
      list: `${baseUrl}/account/balances`,
    },
    order: {
      get: (id: string, symbolPair: string) => `${baseUrl}/orders/${symbolPair}/orderid/${id}`,
      list: `${baseUrl}/orders/open`,
      place: (orderType: string) => `${baseUrl}/orders/${orderType}`,
      cancel: `${baseUrl}/orders/order`,
      // edit: `${baseUrl}/<desired-method>`,
    },
  }

}
