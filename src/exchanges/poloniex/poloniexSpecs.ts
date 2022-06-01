import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaWalletEnum } from '../../lib/enums/AlunaWalletEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const POLONIEX_PRODUCTION_URL = 'https://poloniex.com'



export const poloniexExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
  {
    type: AlunaOrderTypesEnum.LIMIT,
    supported: true,
    implemented: true,
  },
  {
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    supported: true,
    implemented: false,
  },
]



export const poloniexBaseSpecs: IAlunaExchangeSchema = {
  id: 'poloniex',
  name: 'Poloniex',
  signupUrl: 'https://poloniex.com/signup/',
  connectApiUrl: 'https://poloniex.com/apiKeys',
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
      orderTypes: poloniexExchangeOrderTypes,
      wallet: AlunaWalletEnum.SPOT,
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: true,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.DERIVATIVES,
    },
  ],
  settings: {},
}



export const buildPoloniexSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(poloniexBaseSpecs)

  if (referralCode) {
    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`
  }

  specs.settings = settings

  return specs

}


export const getPoloniexEndpoints = (
  _settings: IAlunaSettingsSchema,
) => {

  const baseUrl = POLONIEX_PRODUCTION_URL

  return {
    symbol: {
      list: (query: string) => `${baseUrl}/public?${query}`,
    },
    market: {
      list: (query: string) => `${baseUrl}/public?${query}`,
    },
    key: {
      fetchDetails: `${baseUrl}/tradingApi`,
    },
    balance: {
      list: `${baseUrl}/tradingApi`,
    },
    order: {
      get: `${baseUrl}/tradingApi`,
      list: `${baseUrl}/tradingApi`,
      place: `${baseUrl}/tradingApi`,
      cancel: `${baseUrl}/tradingApi`,
    },
  }
}
