import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { OkxOrderStatusEnum } from '../OkxOrderStatusEnum'



const errorMessagePrefix = 'Order status'


export const translateOrderStatusToAluna = buildAdapter<
  OkxOrderStatusEnum,
  AlunaOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [OkxOrderStatusEnum.LIVE]: AlunaOrderStatusEnum.OPEN,
    [OkxOrderStatusEnum.PARTIALLY_FILLED]:
      AlunaOrderStatusEnum.PARTIALLY_FILLED,
    [OkxOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
    [OkxOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
  },
})

export const translateOrderStatusToOkx = buildAdapter<
  AlunaOrderStatusEnum,
  OkxOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: OkxOrderStatusEnum.LIVE,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          OkxOrderStatusEnum.PARTIALLY_FILLED,
    [AlunaOrderStatusEnum.FILLED]: OkxOrderStatusEnum.FILLED,
    [AlunaOrderStatusEnum.CANCELED]: OkxOrderStatusEnum.CANCELED,
  },
})
