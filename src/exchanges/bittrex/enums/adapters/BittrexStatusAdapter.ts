import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BittrexOrderStatusEnum } from '../BittrexOrderStatusEnum'



export class BittrexStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'

  static translateClosedStatusToAluna = (
    params: { fillQuantity: string; quantity: string },
  ): AlunaOrderStatusEnum => {

    const { fillQuantity, quantity } = params

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

  static translateToAluna =
    buildAdapter<BittrexOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: BittrexStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BittrexOrderStatusEnum.OPEN]: AlunaOrderStatusEnum.OPEN,
        [BittrexOrderStatusEnum.CLOSED]: AlunaOrderStatusEnum.FILLED,
      },
    })



  static translateToBittrex =
    buildAdapter<AlunaOrderStatusEnum, BittrexOrderStatusEnum>({
      errorMessagePrefix: BittrexStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: BittrexOrderStatusEnum.OPEN,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          BittrexOrderStatusEnum.OPEN,
        [AlunaOrderStatusEnum.FILLED]: BittrexOrderStatusEnum.CLOSED,
        [AlunaOrderStatusEnum.CANCELED]: BittrexOrderStatusEnum.CLOSED,
      },
    })



}
