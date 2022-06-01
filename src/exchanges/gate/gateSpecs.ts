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



export const GATE_PRODUCTION_URL = 'https://api.gateio.ws/api/v4'



export const gateExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
  {
    type: AlunaOrderTypesEnum.LIMIT,
    supported: true,
    implemented: true,
  },
]



export const gateBaseSpecs: IAlunaExchangeSchema = {
  id: 'gate',
  name: 'Gate',
  signupUrl: 'https://www.gate.io/signup',
  connectApiUrl: 'https://www.gate.io/myaccount/apiv4keys',
  rateLimitingPerMinute: {
    perApiKey: 50,
    perIp: 50,
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
      orderTypes: gateExchangeOrderTypes,
      wallet: AlunaWalletEnum.SPOT,
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: true,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.DERIVATIVES,
    },
    {
      type: AlunaAccountEnum.LENDING,
      supported: true,
      implemented: false,
      orderTypes: [],
      wallet: AlunaWalletEnum.FUNDING,
    },
  ],
  settings: {},
}



export const buildGateSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(gateBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  specs.settings = settings

  return specs

}


export const getGateEndpoints = (settings: IAlunaSettingsSchema) => {

  const baseUrl = GATE_PRODUCTION_URL

  if (settings.useTestNet) {
    throw new AlunaError({
      code: AlunaExchangeErrorCodes.EXCHANGE_DONT_HAVE_TESTNET,
      message: 'Gate don\'t have a testnet.',
    })
  }

  return {
    symbol: {
      list: `${baseUrl}/spot/currencies`,
    },
    market: {
      list: `${baseUrl}/spot/tickers`,
    },
    key: {
      fetchDetails: `${baseUrl}/wallet/fee`,
    },
    balance: {
      list: `${baseUrl}/spot/accounts`,
    },
    order: {
      get: (id: string, query: string) => `${baseUrl}/spot/orders/${id}?${query}`,
      list: `${baseUrl}/spot/open_orders`,
      place: `${baseUrl}/spot/orders`,
      cancel: (id: string, query: string) => `${baseUrl}/spot/orders/${id}?${query}`,
    },
  }
}
