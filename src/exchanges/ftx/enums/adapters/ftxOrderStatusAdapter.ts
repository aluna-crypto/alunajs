import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { FtxOrderStatusEnum } from '../FtxOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (
  params: {
      fillQuantity: string
      quantity: string
      from: FtxOrderStatusEnum
    },
): AlunaOrderStatusEnum => {

  const { fillQuantity, quantity, from } = params

  const isOpen = from === FtxOrderStatusEnum.OPEN

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



export const translateOrderStatusToFtx = buildAdapter<
  AlunaOrderStatusEnum,
  FtxOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: FtxOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]: FtxOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.FILLED]: FtxOrderStatusEnum.CLOSED,
    [AlunaOrderStatusEnum.CANCELED]: FtxOrderStatusEnum.CLOSED,
  },
})
