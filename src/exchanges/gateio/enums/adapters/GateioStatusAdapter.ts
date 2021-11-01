import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { GateioOrderStatusEnum } from '../GateioOrderStatusEnum'



export class GateioStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<GateioOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: GateioStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        // TODO: implement me

        // [GateioOrderStatusEnum.OPEN]: AlunaOrderStatusEnum.OPEN,
        // [GateioOrderStatusEnum.PARTIALLY_FILLED]:
        //   AlunaOrderStatusEnum.PARTIALLY_FILLED,
        // [GateioOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
        // [GateioOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
      },
    })



  static translateToGateio =
    buildAdapter<AlunaOrderStatusEnum, GateioOrderStatusEnum>({
      errorMessagePrefix: GateioStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        // TODO: implement me

        // [AlunaOrderStatusEnum.OPEN]: GateioOrderStatusEnum.OPEN,
        // [AlunaOrderStatusEnum.PARTIALLY_FILLED]: 
        //   GateioOrderStatusEnum.PARTIALLY_FILLED,
        // [AlunaOrderStatusEnum.FILLED]: GateioOrderStatusEnum.FILLED,
        // [AlunaOrderStatusEnum.CANCELED]: GateioOrderStatusEnum.CANCELED,
      },
    })



}

