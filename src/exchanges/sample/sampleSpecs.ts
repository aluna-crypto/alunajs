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
export const SAMPLE_PRODUCTION_URL = 'https://api.sample.com/v3'



export const sampleExchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
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



export const sampleBaseSpecs: IAlunaExchangeSchema = {
  id: 'sample',
  name: 'Sample',
  // TODO: Review 'signupUrl'
  signupUrl: 'https://sample.com/account/register',
  // TODO: Review 'connectApiUrl'
  connectApiUrl: 'https://sample.com/manage?view=api',
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
      orderTypes: sampleExchangeOrderTypes,
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



export const buildSampleSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const { settings } = params
  const { referralCode } = settings

  const specs = cloneDeep(sampleBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  specs.settings = settings

  return specs

}



export const sampleEndpoints = {
  symbol: {
    // get: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
    list: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
  },
  market: {
    // get: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
    list: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
  },
  key: {
    fetchDetails: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
  },
  balance: {
    list: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
  },
  order: {
    get: (id: string) => `${SAMPLE_PRODUCTION_URL}/<desired-method>/${id}`,
    list: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
    place: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
    cancel: (id: string) => `${SAMPLE_PRODUCTION_URL}/<desired-method>/${id}`,
    // edit: `${SAMPLE_PRODUCTION_URL}/<desired-method>`,
  },
}
