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
    [ValrOrderTypeEnum.LIMIT_POST_ONLY]: AlunaOrderTypesEnum.LIMIT,
    [ValrOrderTypeEnum.STOP_LOSS_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
    [ValrOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [ValrOrderTypeEnum.SIMPLE]: AlunaOrderTypesEnum.MARKET,
    [ValrOrderTypeEnum.TAKE_PROFIT_LIMIT]:
      AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT,
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
    [AlunaOrderTypesEnum.STOP_LIMIT]: ValrOrderTypeEnum.STOP_LOSS_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT]:
      ValrOrderTypeEnum.TAKE_PROFIT_LIMIT,
  },
})

