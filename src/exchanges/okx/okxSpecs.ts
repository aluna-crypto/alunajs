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
import { OkxSymbolTypeEnum } from './enums/OkxSymbolTypeEnum'



export const OKX_PRODUCTION_URL = 'https://www.okx.com/api/v5'



export const okxExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.STOP_MARKET,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
    },
  },
]



export const okxBaseSpecs: IAlunaExchangeSchema = {
  id: 'okx',
  name: 'Okx',
  signupUrl: 'https://www.okx.com/account/register',
  connectApiUrl: 'https://www.okx.com/account/my-api',
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
      orderTypes: okxExchangeOrderTypes,
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



export const buildOkxSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(okxBaseSpecs)

  if (referralCode) {
    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`
  }

  specs.settings = settings

  return specs

}


export const getOkxEndpoints = (
  settings: IAlunaSettingsSchema,
) => {

  const baseUrl = OKX_PRODUCTION_URL

  if (settings.useTestNet) {

    throw new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET,
      message: 'Okx don\'t have a testnet.',
    })

  }

  return {
    symbol: {
      list: (type: OkxSymbolTypeEnum) => `${baseUrl}/public/instruments?instType=${type}`,
    },
    market: {
      list: (type: OkxSymbolTypeEnum) => `${baseUrl}/market/tickers?instType=${type}`,
    },
    key: {
      fetchDetails: `${baseUrl}/account/config`,
    },
    balance: {
      list: `${baseUrl}/account/balance`,
    },
    order: {
      get: (id: string, symbolPair: string) => `${baseUrl}/trade/order?ordId=${id}&$instId=${symbolPair}`,
      list: `${baseUrl}/trade/orders-pending`,
      listStopLimit: (type: string) => `${baseUrl}/trade/orders-algo-pending?ordType=${type}`,
      place: `${baseUrl}/trade/order`,
      placeStopLimit: `${baseUrl}/trade/order-algo`,
      cancel: `${baseUrl}/trade/cancel-order`,
      cancelStopLimit: `${baseUrl}/trade/cancel-algos`,
    },
  }
}
