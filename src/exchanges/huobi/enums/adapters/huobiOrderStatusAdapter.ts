import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { HuobiOrderStatusEnum } from '../HuobiOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = buildAdapter<
HuobiOrderStatusEnum,
AlunaOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [HuobiOrderStatusEnum.SUBMITTED]: AlunaOrderStatusEnum.OPEN,
    [HuobiOrderStatusEnum.CREATED]: AlunaOrderStatusEnum.OPEN,
    [HuobiOrderStatusEnum.PARTIAL_FILLED]:
          AlunaOrderStatusEnum.PARTIALLY_FILLED,
    [HuobiOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
    [HuobiOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
  },
})


export const translateOrderStatusToHuobi = buildAdapter<
  AlunaOrderStatusEnum,
  HuobiOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: HuobiOrderStatusEnum.CREATED,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          HuobiOrderStatusEnum.PARTIAL_FILLED,
    [AlunaOrderStatusEnum.FILLED]: HuobiOrderStatusEnum.FILLED,
    [AlunaOrderStatusEnum.CANCELED]: HuobiOrderStatusEnum.CANCELED,
  },
})
