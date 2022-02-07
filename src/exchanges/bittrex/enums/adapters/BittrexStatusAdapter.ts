import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BittrexOrderStatusEnum } from '../BittrexOrderStatusEnum'



export class BittrexStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



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
