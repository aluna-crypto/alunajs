import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (
  params: {
      fillQuantity: string
      quantity: string
      from: ValrOrderStatusEnum
    },
): AlunaOrderStatusEnum => {

  const { fillQuantity, quantity, from } = params

  const isOpen = from === ValrOrderStatusEnum.OPEN

  if (isOpen) {

    return AlunaOrderStatusEnum.OPEN

  }

  const parsedFillQty = parseFloat(fillQuantity)
  const parsedQty = parseFloat(quantity)

  if (parsedQty === parsedFillQty) {

    return AlunaOrderStatusEnum.FILLED

  }

  if (parsedFillQty > 0) {

    return AlunaOrderStatusEnum.PARTIALLY_FILLED

  }

  return AlunaOrderStatusEnum.CANCELED

}



export const translateOrderStatusToValr = buildAdapter<
  AlunaOrderStatusEnum,
  ValrOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: ValrOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          ValrOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.FILLED]: ValrOrderStatusEnum.CLOSED,
    [AlunaOrderStatusEnum.CANCELED]: ValrOrderStatusEnum.CLOSED,
  },
})

