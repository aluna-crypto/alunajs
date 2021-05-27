import { AccountEnum } from '@lib/enums/AccountEnum'
import { OrderTypesEnum } from '@lib/enums/OrderTypeEnum'



export interface IAlunaExchangeAccountSpecsSchema {
  enabled: boolean
  supported: boolean
  orderSpecs: IAlunaExchangeOrderSpecsSchema[]
}

export interface IAlunaExchangeOrderOptions {

  rate?: number
  amount?: number
  limitRate?: number
  leverage?: number

  // options not implemented
  // trailingRate?: number
  // triggerRate?: number
  // distance?: number
  // trigger?: string | TriggerEnum | TriggerEnum[]
  // closeOnTrigger?: boolean
  // oco?: number
  // hidden?: boolean
  // postOnly?: boolean
  // reduceOnly?: boolean
  // tif?: boolean | string | TimeInForceEnum | TimeInForceEnum[]
  // understandConfirmation?: boolean

}

export interface IAlunaExchangeOrderSpecsSchema {
  enabled: boolean
  supported: boolean
  type: OrderTypesEnum
  options: IAlunaExchangeOrderOptions
}

export interface IAlunaExchangeSpecsSchema {
  acceptFloatAmounts: boolean
  accounts: {
    [AccountEnum.EXCHANGE]: IAlunaExchangeAccountSpecsSchema
    [AccountEnum.MARGIN]: IAlunaExchangeAccountSpecsSchema
    [AccountEnum.DERIVATIVES]: IAlunaExchangeAccountSpecsSchema
  }
}
