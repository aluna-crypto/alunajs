import { cloneDeep } from 'lodash'
import { AlunaError } from '../../lib/core/AlunaError'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaWalletEnum } from '../../lib/enums/AlunaWalletEnum'
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
  },
  {
    type: AlunaOrderTypesEnum.MARKET,
    supported: true,
    implemented: true,
  },
  {
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    supported: true,
    implemented: true,
  },
]



export const huobiBaseSpecs: IAlunaExchangeSchema = {
  id: 'huobi',
  name: 'Huobi',
  signupUrl: 'https://www.huobi.com/en-us/register/',
  connectApiUrl: 'https://www.huobi.com/en-us/apikey/',
  rateLimitingPerMinute: {
    perApiKey: 60,
    perIp: 60,
  },
  features: {
    offersOrderEditing: false,
    offersPositionId: false,
  },
  accounts: [
    {
      type: AlunaAccountEnum.SPOT,
      supported: true,
      implemented: true,
      orderTypes: huobiExchangeOrderTypes,
      wallet: AlunaWalletEnum.SPOT,
    },
    {
      type: AlunaAccountEnum.MARGIN,
      supported: false,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.MARGIN,
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: false,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.DERIVATIVES,
    },
    {
      type: AlunaAccountEnum.LENDING,
      supported: false,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.TRADING,
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
      getStop: `${baseUrl}/v2/algo-orders/specific`,
      list: `${baseUrl}/v1/order/openOrders`,
      listStop: `${baseUrl}/v2/algo-orders/opening`,
      place: `${baseUrl}/v1/order/orders/place`,
      placeStop: `${baseUrl}/v2/algo-orders`,
      cancel: (id: string) => `${baseUrl}/v1/order/orders/${id}/submitcancel`,
    },
    helpers: {
      listAccounts: `${baseUrl}/v1/account/accounts`,
    },
  }
}
