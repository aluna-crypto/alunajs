import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { GateOrderStatusEnum } from '../GateOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (
  params: {
      fillQuantity: string
      quantity: string
      from: GateOrderStatusEnum
    },
): AlunaOrderStatusEnum => {

  const { fillQuantity, quantity, from } = params

  const isOpen = from === GateOrderStatusEnum.OPEN

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



export const translateOrderStatusToGate = buildAdapter<
  AlunaOrderStatusEnum,
  GateOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: GateOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          GateOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.FILLED]: GateOrderStatusEnum.CLOSED,
    [AlunaOrderStatusEnum.CANCELED]: GateOrderStatusEnum.CLOSED,
  },
})

