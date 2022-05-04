import { cloneDeep } from 'lodash'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'



// TODO: Review exchange API
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
  connectApiUrl: 'https://sample.com/Manage?view=api',
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
}



export const buildSampleSpecs = (params: {
  settings: IAlunaSettingsSchema
}) => {

  const {
    settings: {
      referralCode,
    },
  } = params

  const specs = cloneDeep(sampleBaseSpecs)

  if (referralCode) {

    specs.signupUrl = `${specs.signupUrl}?referralCode=${referralCode}`

  }

  return specs

}
