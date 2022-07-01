import { AlunaOrderTypesEnum } from '../../src/lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
} from '../../src/lib/modules/authed/IAlunaOrderModule'



export const commonPlaceParams: Partial<IAlunaOrderPlaceParams> = {
  amount: 100,
  symbolPair: 'BTC/USD',
  clientOrderId: '99666',
}

export const commonEditParams: Partial<IAlunaOrderEditParams> = {
  id: 'id',
  ...commonPlaceParams,
}

export const orderTypesParamsDict = {
  [AlunaOrderTypesEnum.LIMIT]: {
    rate: 10,
  },
  [AlunaOrderTypesEnum.MARKET]: {},
  [AlunaOrderTypesEnum.STOP_MARKET]: {
    stopRate: 11,
  },
  [AlunaOrderTypesEnum.STOP_LIMIT]: {
    stopRate: 11,
    limitRate: 12,
  },
}

