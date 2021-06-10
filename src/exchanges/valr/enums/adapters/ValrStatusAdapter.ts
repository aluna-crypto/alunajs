import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'



export class ValrStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<ValrOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: ValrStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [ValrOrderStatusEnum.ACTIVE]: AlunaOrderStatusEnum.OPEN,
        [ValrOrderStatusEnum.PLACED]: AlunaOrderStatusEnum.OPEN,
        [ValrOrderStatusEnum.PARTIALLY_FILLED]:
        AlunaOrderStatusEnum.PARTIALLY_FILLED,
        [ValrOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
        [ValrOrderStatusEnum.FAILED]: AlunaOrderStatusEnum.CANCELED,
        [ValrOrderStatusEnum.CANCELLED]: AlunaOrderStatusEnum.CANCELED,
      },
    })



  static translateToValr =
    buildAdapter<AlunaOrderStatusEnum, ValrOrderStatusEnum>({
      errorMessagePrefix: ValrStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: ValrOrderStatusEnum.PLACED,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
        ValrOrderStatusEnum.PARTIALLY_FILLED,
        [AlunaOrderStatusEnum.FILLED]: ValrOrderStatusEnum.FILLED,
        [AlunaOrderStatusEnum.CANCELED]: ValrOrderStatusEnum.CANCELLED,
      },
    })



}

