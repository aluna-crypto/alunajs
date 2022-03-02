import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaAdaptersErrorCodes } from '../../../../lib/errors/AlunaAdaptersErrorCodes'
import { GateioLog } from '../../GateioLog'
import { GateioOrderStatusEnum } from '../GateioOrderStatusEnum'



export class GateioStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'

  static translateToAluna = (
    params: {
      leftToFill: number,
      amount: number,
      from: GateioOrderStatusEnum,
    },
  ): AlunaOrderStatusEnum => {

    const { leftToFill, from, amount } = params

    const isPartiallyFilled = leftToFill > 0 && leftToFill !== amount

    if (isPartiallyFilled) {

      return AlunaOrderStatusEnum.PARTIALLY_FILLED

    }

    const isOpen = from === GateioOrderStatusEnum.OPEN

    if (isOpen) {

      return AlunaOrderStatusEnum.OPEN

    }

    const isClosed = from === GateioOrderStatusEnum.CLOSED

    if (isClosed) {

      return AlunaOrderStatusEnum.FILLED

    }

    const isCancelled = from === GateioOrderStatusEnum.CANCELLED

    if (isCancelled) {

      return AlunaOrderStatusEnum.CANCELED

    }

    const error = new AlunaError({
      message: `${this.ERROR_MESSAGE_PREFIX} not supported: ${from}`,
      code: AlunaAdaptersErrorCodes.NOT_SUPPORTED,
    })

    GateioLog.error(error)

    throw error

  }



  static translateToGateio =
    buildAdapter<AlunaOrderStatusEnum, GateioOrderStatusEnum>({
      errorMessagePrefix: GateioStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: GateioOrderStatusEnum.OPEN,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          GateioOrderStatusEnum.OPEN,
        [AlunaOrderStatusEnum.FILLED]: GateioOrderStatusEnum.CLOSED,
        [AlunaOrderStatusEnum.CANCELED]: GateioOrderStatusEnum.CANCELLED,
      },
    })



}
