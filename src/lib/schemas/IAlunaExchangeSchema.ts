import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'



export interface IAlunaExchangeSchema {
  id: string
  name: string
  signupUrl: string
  connectApiUrl: string
  affiliateCode?: string
  rateLimitingPerMinute: {
    perApiKey: number,
    perIp: number,
  }
  modes: {
    balance: AlunaFeaturesModeEnum,
    order: AlunaFeaturesModeEnum,
    position?: AlunaFeaturesModeEnum,
  }
  accounts: IAlunaExchangeAccountSpecsSchema[]
}

export interface IAlunaExchangeAccountSpecsSchema {
  type: AlunaAccountEnum
  supported: boolean // supported by the exchange
  implemented?: boolean // implemented by aluna
  orderTypes?: IAlunaExchangeOrderSpecsSchema[]
}

export interface IAlunaExchangeOrderSpecsSchema {
  type: AlunaOrderTypesEnum
  supported: boolean // supported by the exchange
  implemented: boolean // implemented by aluna
  mode: AlunaFeaturesModeEnum
  options: IAlunaExchangeOrderOptionsSchema
}

export interface IAlunaExchangeOrderOptionsSchema {

  rate?: number
  amount?: number
  limitRate?: number
  leverage?: number

  /*
    Options not yet implemented:

    trailingRate?: number
    triggerRate?: number
    distance?: number
    trigger?: string | TriggerEnum | TriggerEnum[]
    closeOnTrigger?: boolean
    oco?: number
    hidden?: boolean
    postOnly?: boolean
    reduceOnly?: boolean
    tif?: boolean | string | TimeInForceEnum | TimeInForceEnum[]
    understandConfirmation?: boolean

  */

}
