import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { GateioOrderTypeEnum } from '../GateioOrderTypeEnum'



export class GateioOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<GateioOrderTypeEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: GateioOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [GateioOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
      },
    })



  static translateToGateio =
    buildAdapter<AlunaOrderTypesEnum, GateioOrderTypeEnum>({
      errorMessagePrefix: GateioOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: GateioOrderTypeEnum.LIMIT,
      },
    })



}
