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



export const HUOBI_PRODUCTION_URL = 'https://api.huobi.pro'


export const huobiExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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



export const huobiBaseSpecs: IAlunaExchangeSchema = {
  id: 'huobi',
  name: 'Huobi',
  // TODO: Review 'signupUrl'
  signupUrl: 'https://huobi.com/account/register',
  // TODO: Review 'connectApiUrl'
  connectApiUrl: 'https://huobi.com/manage?view=api',
  // TODO: Review exchange rates limits
  rateLimitingPerMinute: {
    perApiKey: 0,
    perIp: 0,
  },
  // TODO: Review supported features
  features: {
    offersOrderEditing: false,
    offersPositionId: false,
  },
  accounts: [
    // TODO: Review supported/implemented accounts
    {
      type: AlunaAccountEnum.SPOT,
      supported: true,
      implemented: true,
      orderTypes: huobiExchangeOrderTypes,
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



export const buildHuobiSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(huobiBaseSpecs)

  if (referralCode) {
    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`
  }

  specs.settings = settings

  return specs

}


export const getHuobiEndpoints = (
  settings: IAlunaSettingsSchema,
) => {

  const baseUrl = HUOBI_PRODUCTION_URL

  if (settings.useTestNet) {

    throw new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET,
      message: 'Huobi don\'t have a testnet.',
    })

  }

  return {
    symbol: {
      list: `${baseUrl}/v1/settings/common/market-symbols`,
    },
    market: {
      list: `${baseUrl}/market/tickers`,
    },
    key: {
      fetchUserId: `${baseUrl}/v2/user/uid`,
      fetchDetails: `${baseUrl}/v2/user/api-key`,
    },
    balance: {
      list: (accountId: number) => `${baseUrl}/v1/account/accounts/${accountId}/balance`,
    },
    order: {
      get: (id: string) => `${baseUrl}/v1/order/orders/${id}`,
      list: `${baseUrl}/v1/order/openOrders`,
      place: `${baseUrl}/v1/order/orders/place`,
      cancel: (id: string) => `${baseUrl}/v1/order/orders/${id}/submitcancel`,
    },
    helpers: {
      listAccounts: `${baseUrl}/v1/account/accounts`,
    },
  }
}
