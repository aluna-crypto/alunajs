import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaAdaptersErrorCodes } from '../../../../lib/errors/AlunaAdaptersErrorCodes'
import { GateOrderStatusEnum } from '../GateOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (
  params: {
      leftToFill: number
      amount: number
      from: GateOrderStatusEnum
    },
): AlunaOrderStatusEnum => {

  const { leftToFill, from, amount } = params

  const isPartiallyFilled = leftToFill > 0 && leftToFill !== amount

  if (isPartiallyFilled) {

    return AlunaOrderStatusEnum.PARTIALLY_FILLED

  }

  const isOpen = from === GateOrderStatusEnum.OPEN

  if (isOpen) {

    return AlunaOrderStatusEnum.OPEN

  }

  const isClosed = from === GateOrderStatusEnum.CLOSED

  if (isClosed) {

    return AlunaOrderStatusEnum.FILLED

  }

  const isCancelled = from === GateOrderStatusEnum.CANCELLED

  if (isCancelled) {

    return AlunaOrderStatusEnum.CANCELED

  }

  const error = new AlunaError({
    message: `${errorMessagePrefix} not supported: ${from}`,
    code: AlunaAdaptersErrorCodes.NOT_SUPPORTED,
  })

  throw error

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
    [AlunaOrderStatusEnum.CANCELED]: GateOrderStatusEnum.CANCELLED,
  },
})

