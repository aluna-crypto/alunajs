import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { OkxOrderStatusEnum } from '../OkxOrderStatusEnum'



export class OkxStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<OkxOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: OkxStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [OkxOrderStatusEnum.LIVE]: AlunaOrderStatusEnum.OPEN,
        [OkxOrderStatusEnum.PARTIALLY_FILLED]:
          AlunaOrderStatusEnum.PARTIALLY_FILLED,
        [OkxOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
        [OkxOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
      },
    })



  static translateToOkx =
    buildAdapter<AlunaOrderStatusEnum, OkxOrderStatusEnum>({
      errorMessagePrefix: OkxStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: OkxOrderStatusEnum.LIVE,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          OkxOrderStatusEnum.PARTIALLY_FILLED,
        [AlunaOrderStatusEnum.FILLED]: OkxOrderStatusEnum.FILLED,
        [AlunaOrderStatusEnum.CANCELED]: OkxOrderStatusEnum.CANCELED,
      },
    })



}

