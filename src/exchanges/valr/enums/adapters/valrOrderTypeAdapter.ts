import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { ValrOrderTypeEnum } from '../ValrOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  ValrOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [ValrOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [ValrOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [ValrOrderTypeEnum.CEILING_LIMIT]:
          AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [ValrOrderTypeEnum.CEILING_MARKET]:
          AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToValr = buildAdapter<
  AlunaOrderTypesEnum,
  ValrOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: ValrOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: ValrOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]:
          ValrOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]:
          ValrOrderTypeEnum.CEILING_MARKET,
  },
})

