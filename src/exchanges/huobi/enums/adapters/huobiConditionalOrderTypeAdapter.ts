import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { HuobiConditionalOrderTypeEnum } from '../HuobiConditionalOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateConditionalOrderTypeToAluna = buildAdapter<
  HuobiConditionalOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [HuobiConditionalOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
    [HuobiConditionalOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.STOP_MARKET,
  },
})



export const translateConditionalOrderTypeToHuobi = buildAdapter<
  AlunaOrderTypesEnum,
  HuobiConditionalOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.STOP_LIMIT]: HuobiConditionalOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.STOP_MARKET]: HuobiConditionalOrderTypeEnum.MARKET,
  },
})
