import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { HuobiConditionalOrderStatusEnum } from '../HuobiConditionalOrderStatusEnum'



const errorMessagePrefix = 'Order type'



export const translateConditionalOrderStatusToAluna = buildAdapter<
  HuobiConditionalOrderStatusEnum,
  AlunaOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [HuobiConditionalOrderStatusEnum.CREATED]: AlunaOrderStatusEnum.OPEN,
    [HuobiConditionalOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
    [HuobiConditionalOrderStatusEnum.REJECTED]: AlunaOrderStatusEnum.CANCELED,
    [HuobiConditionalOrderStatusEnum.TRIGGERED]: AlunaOrderStatusEnum.FILLED,
  },
})



export const translateConditionalOrderStatusToHuobi = buildAdapter<
  AlunaOrderStatusEnum,
  HuobiConditionalOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: HuobiConditionalOrderStatusEnum.CREATED,
    [AlunaOrderStatusEnum.CANCELED]: HuobiConditionalOrderStatusEnum.CANCELED,
    [AlunaOrderStatusEnum.FILLED]: HuobiConditionalOrderStatusEnum.TRIGGERED,
  },
})
