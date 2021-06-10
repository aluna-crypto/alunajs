import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'



export interface IAlunaExchangeOrderTypesSpecsSchema {
  [AlunaOrderTypesEnum.LIMIT]?: IAlunaExchangeOrderSpecsSchema
  [AlunaOrderTypesEnum.MARKET]?: IAlunaExchangeOrderSpecsSchema
  [AlunaOrderTypesEnum.STOP_MARKET]?: IAlunaExchangeOrderSpecsSchema
  [AlunaOrderTypesEnum.STOP_LIMIT]?: IAlunaExchangeOrderSpecsSchema

  [AlunaOrderTypesEnum.TRAILING_STOP]?: IAlunaExchangeOrderSpecsSchema

  [AlunaOrderTypesEnum.FILL_OF_KILL]?: IAlunaExchangeOrderSpecsSchema
  [AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL]?: IAlunaExchangeOrderSpecsSchema
  [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]?: IAlunaExchangeOrderSpecsSchema

  [AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT]?: IAlunaExchangeOrderSpecsSchema
  [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]?: IAlunaExchangeOrderSpecsSchema
}

export interface IAlunaExchangeAccountSpecsSchema {
  supported: boolean // supported by the exchange
  implemented?: boolean // implemented by aluna
  orderTypes?: IAlunaExchangeOrderTypesSpecsSchema
}

export interface IAlunaExchangeOrderOptionsSchema {

  rate?: number
  amount?: number
  limitRate?: number
  leverage?: number

  /*
    Options not yet implemented
  */

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
  supported: boolean // supported by the exchange
  implemented: boolean // implemented by aluna
  mode: AlunaFeaturesModeEnum
  options: IAlunaExchangeOrderOptionsSchema
}

export interface IAlunaExchangeSpecsSchema {
  id: string
  acceptFloatAmounts: boolean
  features: {
    balance: AlunaFeaturesModeEnum,
    order: AlunaFeaturesModeEnum,
    position?: AlunaFeaturesModeEnum,
  }
  accounts: {
    [AlunaAccountEnum.EXCHANGE]: IAlunaExchangeAccountSpecsSchema,
    [AlunaAccountEnum.MARGIN]: IAlunaExchangeAccountSpecsSchema,
    [AlunaAccountEnum.DERIVATIVES]: IAlunaExchangeAccountSpecsSchema,
    [AlunaAccountEnum.LENDING]: IAlunaExchangeAccountSpecsSchema,
  }
}
