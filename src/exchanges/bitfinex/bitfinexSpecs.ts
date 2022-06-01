import { cloneDeep } from 'lodash'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaExchangeErrorCodes } from '../../lib/errors/AlunaExchangeErrorCodes'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



export const BITFINEX_AUTHED_URL = 'https://api.bitfinex.com/v2'
export const BITFINEX_PUBLIC_URL = 'https://api-pub.bitfinex.com/v2'



export const bitfinexExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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
  {
    type: AlunaOrderTypesEnum.STOP_MARKET,
    supported: true,
    implemented: true,
  },
]



export const bitfinexBaseSpecs: IAlunaExchangeSchema = {
  id: 'bitfinex',
  name: 'Bitfinex',
  signupUrl: 'https://www.bitfinex.com/sign-up/',
  connectApiUrl: 'https://setting.bitfinex.com/api#new-key',
  rateLimitingPerMinute: {
    perApiKey: -1,
    perIp: 70,
  },
  features: {
    offersOrderEditing: true,
    offersPositionId: true,
  },
  accounts: [
    {
      type: AlunaAccountEnum.SPOT,
      supported: true,
      implemented: true,
      orderTypes: bitfinexExchangeOrderTypes,
    },
    {
      type: AlunaAccountEnum.MARGIN,
      supported: true,
      implemented: true,
      orderTypes: bitfinexExchangeOrderTypes,
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



export const getBitfinexEndpoints = (settings: IAlunaSettingsSchema) => {

  const basePublicUrl = BITFINEX_PUBLIC_URL
  const baseAuthedUrl = BITFINEX_AUTHED_URL

  if (settings.useTestNet) {
    throw new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET,
      message: 'Bitfinex don\'t have a testnet.',
    })
  }

  return {
    symbol: {
      list: `${basePublicUrl}/conf/pub:list:currency,pub:map:currency:label`,
    },
    market: {
      tickers: `${basePublicUrl}/tickers?symbols=ALL`,
      enabledMarginCurrencies: `${basePublicUrl}/conf/pub:list:pair:margin`,
    },
    key: {
      fetchDetails: `${baseAuthedUrl}/auth/r/permissions`,
      account: `${baseAuthedUrl}/auth/r/info/user`,
    },
    balance: {
      list: `${baseAuthedUrl}/auth/r/wallets`,
      getTradableBalance: `${baseAuthedUrl}/auth/calc/order/avail`,
    },
    order: {
      get: (symbolPair: string) => `${baseAuthedUrl}/auth/r/orders/${symbolPair}`,
      getHistory: (symbolPair: string) => `${baseAuthedUrl}/auth/r/orders/${symbolPair}/hist`,
      list: `${baseAuthedUrl}/auth/r/orders`,
      place: `${baseAuthedUrl}/auth/w/order/submit`,
      cancel: `${baseAuthedUrl}/auth/w/order/cancel`,
      edit: `${baseAuthedUrl}/auth/w/order/update`,
    },
    position: {
      get: `${baseAuthedUrl}/auth/r/positions/audit`,
      list: `${baseAuthedUrl}/auth/r/positions`,
    },
  }
}
