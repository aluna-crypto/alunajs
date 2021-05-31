import { AccountEnum } from '../enums/AccountEnum'
import { FeaturesModeEnum } from '../enums/FeaturesModeEnum'
import { OrderTypesEnum } from '../enums/OrderTypeEnum'



export interface IAlunaExchangeOrderTypesSpecsSchema {
  [OrderTypesEnum.LIMIT]?: IAlunaExchangeOrderSpecsSchema
  [OrderTypesEnum.MARKET]?: IAlunaExchangeOrderSpecsSchema
  [OrderTypesEnum.STOP_MARKET]?: IAlunaExchangeOrderSpecsSchema
  [OrderTypesEnum.STOP_LIMIT]?: IAlunaExchangeOrderSpecsSchema

  [OrderTypesEnum.TRAILING_STOP]?: IAlunaExchangeOrderSpecsSchema

  [OrderTypesEnum.FILL_OF_KILL]?: IAlunaExchangeOrderSpecsSchema
  [OrderTypesEnum.IMMEDIATE_OR_CANCEL]?: IAlunaExchangeOrderSpecsSchema
  [OrderTypesEnum.LIMIT_ORDER_BOOK]?: IAlunaExchangeOrderSpecsSchema

  [OrderTypesEnum.TAKE_PROFIT_LIMIT]?: IAlunaExchangeOrderSpecsSchema
  [OrderTypesEnum.TAKE_PROFIT_MARKET]?: IAlunaExchangeOrderSpecsSchema
}

export interface IAlunaExchangeAccountSpecsSchema {
  implemented: boolean // implemented by aluna
  supported: boolean // supported by the exchange
  orderTypes?: IAlunaExchangeOrderTypesSpecsSchema // unsupported if missing
}

export interface IAlunaExchangeOrderOptionsSchema {

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
  supported: boolean // supported by the exchange
  implemented: boolean // implemented by aluna
  options: IAlunaExchangeOrderOptionsSchema
}

export interface IAlunaExchangeSpecsSchema {
  acceptFloatAmounts: boolean
  features: {
    balance: FeaturesModeEnum,
    order: FeaturesModeEnum,
    position?: FeaturesModeEnum,
  }
  accounts: {
    [AccountEnum.EXCHANGE]: IAlunaExchangeAccountSpecsSchema,
    [AccountEnum.MARGIN]: IAlunaExchangeAccountSpecsSchema,
    [AccountEnum.DERIVATIVES]: IAlunaExchangeAccountSpecsSchema,
    [AccountEnum.LENDING]: IAlunaExchangeAccountSpecsSchema,
  }
}
