import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { GateIOOrderStatusEnum } from '../GateIOOrderStatusEnum'



export class GateIOStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<GateIOOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: GateIOStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        // TODO: implement me

        // [GateIOOrderStatusEnum.OPEN]: AlunaOrderStatusEnum.OPEN,
        // [GateIOOrderStatusEnum.PARTIALLY_FILLED]:
        //   AlunaOrderStatusEnum.PARTIALLY_FILLED,
        // [GateIOOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
        // [GateIOOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
      },
    })



  static translateToGateIO =
    buildAdapter<AlunaOrderStatusEnum, GateIOOrderStatusEnum>({
      errorMessagePrefix: GateIOStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        // TODO: implement me

        // [AlunaOrderStatusEnum.OPEN]: GateIOOrderStatusEnum.OPEN,
        // [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
        //   GateIOOrderStatusEnum.PARTIALLY_FILLED,
        // [AlunaOrderStatusEnum.FILLED]: GateIOOrderStatusEnum.FILLED,
        // [AlunaOrderStatusEnum.CANCELED]: GateIOOrderStatusEnum.CANCELED,
      },
    })



}
