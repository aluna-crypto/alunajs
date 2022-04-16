import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { HuobiOrderStatusEnum } from '../HuobiOrderStatusEnum'



export class HuobiStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<HuobiOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: HuobiStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [HuobiOrderStatusEnum.SUBMITTED]: AlunaOrderStatusEnum.OPEN,
        [HuobiOrderStatusEnum.CREATED]: AlunaOrderStatusEnum.OPEN,
        [HuobiOrderStatusEnum.PARTIAL_FILLED]:
          AlunaOrderStatusEnum.PARTIALLY_FILLED,
        [HuobiOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
        [HuobiOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
      },
    })



  static translateToHuobi =
    buildAdapter<AlunaOrderStatusEnum, HuobiOrderStatusEnum>({
      errorMessagePrefix: HuobiStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: HuobiOrderStatusEnum.CREATED,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          HuobiOrderStatusEnum.PARTIAL_FILLED,
        [AlunaOrderStatusEnum.FILLED]: HuobiOrderStatusEnum.FILLED,
        [AlunaOrderStatusEnum.CANCELED]: HuobiOrderStatusEnum.CANCELED,
      },
    })



}

