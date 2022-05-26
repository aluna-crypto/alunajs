import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { FtxOrderStatusEnum } from '../FtxOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (
  params: {
      filledSize: number
      size: number
      status: FtxOrderStatusEnum
    },
): AlunaOrderStatusEnum => {

  const { filledSize, size, status } = params

  const isClosed = status === FtxOrderStatusEnum.CLOSED

  if (isClosed) {

    const isFilled = filledSize === size

    if (isFilled) {

      return AlunaOrderStatusEnum.FILLED

    }

    return AlunaOrderStatusEnum.CANCELED

  }

  const isPartiallyFilled = filledSize > 0 && filledSize < size

  if (isPartiallyFilled) {

    return AlunaOrderStatusEnum.PARTIALLY_FILLED

  }

  return AlunaOrderStatusEnum.OPEN

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
