import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { GateioOrderStatusEnum } from '../GateioOrderStatusEnum'



export class GateioStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'

  static translateToAluna =
    buildAdapter<GateioOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: GateioStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [GateioOrderStatusEnum.OPEN]: AlunaOrderStatusEnum.OPEN,
        [GateioOrderStatusEnum.CLOSED]: AlunaOrderStatusEnum.FILLED,
        [GateioOrderStatusEnum.CANCELLED]: AlunaOrderStatusEnum.CANCELED,
      },
    })



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
