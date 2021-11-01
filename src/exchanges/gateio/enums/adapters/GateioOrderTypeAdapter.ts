import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { GateioOrderTypesEnum } from '../GateioOrderTypesEnum'



export class GateioOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<GateioOrderTypesEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: GateioOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        // TODO implement me

        // [GateioOrderTypesEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        // [GateioOrderTypesEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
      },
    })



  static translateToGateio =
    buildAdapter<AlunaOrderTypesEnum, GateioOrderTypesEnum>({
      errorMessagePrefix: GateioOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        // TODO implement me

        // [AlunaOrderTypesEnum.LIMIT]: GateioOrderTypesEnum.LIMIT,
        // [AlunaOrderTypesEnum.MARKET]: GateioOrderTypesEnum.MARKET,
      },
    })


}
