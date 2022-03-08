import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { FtxOrderStatusEnum } from '../FtxOrderStatusEnum'



export class FtxStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'


  static translateToAluna = (
    params: {
        from: FtxOrderStatusEnum,
        size: number,
        filledSize: number,
    },
  ) => {

    const { filledSize, from, size } = params


    const isClosed = from === FtxOrderStatusEnum.CLOSED

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



  static translateToFtx =
    buildAdapter<AlunaOrderStatusEnum, FtxOrderStatusEnum>({
      errorMessagePrefix: FtxStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]: FtxOrderStatusEnum.OPEN,
        [AlunaOrderStatusEnum.OPEN]: FtxOrderStatusEnum.OPEN,
        [AlunaOrderStatusEnum.FILLED]: FtxOrderStatusEnum.CLOSED,
        [AlunaOrderStatusEnum.CANCELED]: FtxOrderStatusEnum.CLOSED,
      },
    })



}

