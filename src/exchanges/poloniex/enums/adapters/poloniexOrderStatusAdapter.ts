import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { PoloniexOrderStatusEnum } from '../PoloniexOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (
  params: {
      fillQuantity: string
      quantity: string
      from: PoloniexOrderStatusEnum
    },
): AlunaOrderStatusEnum => {

  const { fillQuantity, quantity, from } = params

  const isOpen = from === PoloniexOrderStatusEnum.OPEN

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



export const translateOrderStatusToPoloniex = buildAdapter<
  AlunaOrderStatusEnum,
  PoloniexOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: PoloniexOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]: PoloniexOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.FILLED]: PoloniexOrderStatusEnum.CLOSED,
    [AlunaOrderStatusEnum.CANCELED]: PoloniexOrderStatusEnum.CLOSED,
  },
})
