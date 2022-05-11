import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BitmexOrderStatusEnum } from '../BitmexOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (
  params: {
      fillQuantity: string
      quantity: string
      from: BitmexOrderStatusEnum
    },
): AlunaOrderStatusEnum => {

  const { fillQuantity, quantity, from } = params

  const isOpen = from === BitmexOrderStatusEnum.OPEN

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



export const translateOrderStatusToBitmex = buildAdapter<
  AlunaOrderStatusEnum,
  BitmexOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: BitmexOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]: BitmexOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.FILLED]: BitmexOrderStatusEnum.CLOSED,
    [AlunaOrderStatusEnum.CANCELED]: BitmexOrderStatusEnum.CLOSED,
  },
})
