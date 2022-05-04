import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const BITTREX_PRODUCTION_URL = 'https://api.bittrex.com/v3'



export const bittrexExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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



export const bittrexBaseSpecs: IAlunaExchangeSchema = {
  id: 'bittrex',
  name: 'Bittrex',
  signupUrl: 'https://global.bittrex.com/account/register',
  connectApiUrl: 'https://global.bittrex.com/Manage?view=api',
  rateLimitingPerMinute: {
    perApiKey: 60,
    perIp: 60,
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
      orderTypes: bittrexExchangeOrderTypes,
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
}



export const buildBittrexSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const {
    settings: {
      referralCode,
    },
  } = params

  const specs = cloneDeep(bittrexBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  return specs

}



export const bittrexEndpoints = {
  symbol: {
    list: `${BITTREX_PRODUCTION_URL}/currencies`,
  },
  market: {
    markets: `${BITTREX_PRODUCTION_URL}/markets`,
    summaries: `${BITTREX_PRODUCTION_URL}/markets/summaries`,
    tickers: `${BITTREX_PRODUCTION_URL}/markets/tickers`,
  },
  key: {
    account: `${BITTREX_PRODUCTION_URL}/account`,
  },
  balance: {
    list: `${BITTREX_PRODUCTION_URL}/balances`,
  },
  order: {
    get: (id: string) => `${BITTREX_PRODUCTION_URL}/orders/${id}`,
    list: `${BITTREX_PRODUCTION_URL}/orders/open`,
    place: `${BITTREX_PRODUCTION_URL}/orders`,
    cancel: (id: string) => `${BITTREX_PRODUCTION_URL}/orders/${id}`,
  },
}
