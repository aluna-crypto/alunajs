import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaAdaptersErrorCodes } from '../../../../lib/errors/AlunaAdaptersErrorCodes'
import { FtxOrderStatusEnum } from '../FtxOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (
  params: {
      size: number
      status: FtxOrderStatusEnum
      filledSize: number
    },
): AlunaOrderStatusEnum => {

  const {
    size,
    status,
    filledSize,
  } = params

  let alunaStatus: AlunaOrderStatusEnum

  const isSizeFilled = filledSize === size
  const isPartiallyFilled = filledSize > 0 && filledSize < size

  switch (status) {

    case FtxOrderStatusEnum.NEW:
      alunaStatus = AlunaOrderStatusEnum.OPEN
      break

    case FtxOrderStatusEnum.OPEN:
      if (isPartiallyFilled) {
        alunaStatus = AlunaOrderStatusEnum.PARTIALLY_FILLED
      } else {
        alunaStatus = AlunaOrderStatusEnum.OPEN
      }
      break

    case FtxOrderStatusEnum.CANCELLED:
      alunaStatus = AlunaOrderStatusEnum.CANCELED
      break

    case FtxOrderStatusEnum.CLOSED:
      if (isSizeFilled) {
        alunaStatus = AlunaOrderStatusEnum.FILLED
      } else {
        alunaStatus = AlunaOrderStatusEnum.CANCELED
      }

      break

    case FtxOrderStatusEnum.TRIGGERED:
      alunaStatus = AlunaOrderStatusEnum.FILLED
      break

    default:

      throw new AlunaError({
        message: `${errorMessagePrefix} not supported: ${status}`,
        code: AlunaAdaptersErrorCodes.NOT_SUPPORTED,
      })

  }

  return alunaStatus

}



export const translateOrderStatusToFtx = buildAdapter<
  AlunaOrderStatusEnum,
  FtxOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: FtxOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]: FtxOrderStatusEnum.OPEN,
    [AlunaOrderStatusEnum.CANCELED]: FtxOrderStatusEnum.CLOSED,
    [AlunaOrderStatusEnum.FILLED]: FtxOrderStatusEnum.CLOSED,
  },
})
