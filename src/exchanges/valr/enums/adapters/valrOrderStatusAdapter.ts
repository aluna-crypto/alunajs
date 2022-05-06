import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = buildAdapter<
  ValrOrderStatusEnum,
  AlunaOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [ValrOrderStatusEnum.ACTIVE]: AlunaOrderStatusEnum.OPEN,
    [ValrOrderStatusEnum.PLACED]: AlunaOrderStatusEnum.OPEN,
    [ValrOrderStatusEnum.REQUESTED]: AlunaOrderStatusEnum.OPEN,
    [ValrOrderStatusEnum.PARTIALLY_FILLED]:
        AlunaOrderStatusEnum.PARTIALLY_FILLED,
    [ValrOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
    [ValrOrderStatusEnum.FAILED]: AlunaOrderStatusEnum.CANCELED,
    [ValrOrderStatusEnum.EXPIRED]: AlunaOrderStatusEnum.CANCELED,
    [ValrOrderStatusEnum.CANCELLED]: AlunaOrderStatusEnum.CANCELED,
  },
})



export const translateOrderStatusToValr = buildAdapter<
  AlunaOrderStatusEnum,
  ValrOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: ValrOrderStatusEnum.PLACED,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
        ValrOrderStatusEnum.PARTIALLY_FILLED,
    [AlunaOrderStatusEnum.FILLED]: ValrOrderStatusEnum.FILLED,
    [AlunaOrderStatusEnum.CANCELED]: ValrOrderStatusEnum.CANCELLED,
  },
})

