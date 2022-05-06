import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { GateOrderTypeEnum } from '../GateOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  GateOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [GateOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [GateOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [GateOrderTypeEnum.CEILING_LIMIT]:
          AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [GateOrderTypeEnum.CEILING_MARKET]:
          AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToGate = buildAdapter<
  AlunaOrderTypesEnum,
  GateOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: GateOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: GateOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]:
          GateOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]:
          GateOrderTypeEnum.CEILING_MARKET,
  },
})

