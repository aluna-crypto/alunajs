import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { FtxOrderStatusEnum } from '../FtxOrderStatusEnum'



export class FtxStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<FtxOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: FtxStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [FtxOrderStatusEnum.NEW]: AlunaOrderStatusEnum.OPEN,
        [FtxOrderStatusEnum.OPEN]:
          AlunaOrderStatusEnum.OPEN,
        [FtxOrderStatusEnum.CLOSED]: AlunaOrderStatusEnum.FILLED,
      },
    })



  static translateToFtx =
    buildAdapter<AlunaOrderStatusEnum, FtxOrderStatusEnum>({
      errorMessagePrefix: FtxStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: FtxOrderStatusEnum.OPEN,
        [AlunaOrderStatusEnum.FILLED]: FtxOrderStatusEnum.CLOSED,
        [AlunaOrderStatusEnum.CANCELED]: FtxOrderStatusEnum.CLOSED,
      },
    })



}

