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
export const FTX_PRODUCTION_URL = 'https://api.ftx.com/v3'
export const FTX_TESTNET_URL = 'https://testnet.api.ftx.com/v3'



export const ftxExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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



export const ftxBaseSpecs: IAlunaExchangeSchema = {
  id: 'ftx',
  name: 'Ftx',
  // TODO: Review 'signupUrl'
  signupUrl: 'https://ftx.com/account/register',
  // TODO: Review 'connectApiUrl'
  connectApiUrl: 'https://ftx.com/manage?view=api',
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
      type: AlunaAccountEnum.SPOT,
      supported: true,
      implemented: true,
      orderTypes: ftxExchangeOrderTypes,
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



export const buildFtxSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(ftxBaseSpecs)

  if (referralCode) {
    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`
  }

  specs.settings = settings

  return specs

}


export const getFtxEndpoints = (
  settings: IAlunaSettingsSchema,
) => {

  let baseUrl = FTX_PRODUCTION_URL

  if (settings.useTestNet) {
    baseUrl = FTX_TESTNET_URL
    /*
      throw new AlunaError({
        code: ExchangeErrorCodes.EXCHANGE_DONT_PROVIDE_TESTNET,
        message: 'Ftx don't have a testnet.',
      })
    */
  }

  return {
    symbol: {
      get: `${baseUrl}/<desired-method>`,
      list: `${baseUrl}/<desired-method>`,
    },
    market: {
      get: `${baseUrl}/<desired-method>`,
      list: `${baseUrl}/<desired-method>`,
    },
    key: {
      fetchDetails: `${baseUrl}/<desired-method>`,
    },
    balance: {
      list: `${baseUrl}/<desired-method>`,
    },
    order: {
      get: (id: string) => `${baseUrl}/<desired-method>/${id}`,
      list: `${baseUrl}/<desired-method>`,
      place: `${baseUrl}/<desired-method>`,
      cancel: (id: string) => `${baseUrl}/<desired-method>/${id}`,
      edit: `${baseUrl}/<desired-method>`,
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
