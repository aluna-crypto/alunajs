import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { GateIOOrderTypesEnum } from '../GateIOOrderTypesEnum'



export class GateIOOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<GateIOOrderTypesEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: GateIOOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        // TODO implement me

        // [GateIOOrderTypesEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        // [GateIOOrderTypesEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
      },
    })



  static translateToGateIO =
    buildAdapter<AlunaOrderTypesEnum, GateIOOrderTypesEnum>({
      errorMessagePrefix: GateIOOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        // TODO implement me

        // [AlunaOrderTypesEnum.LIMIT]: GateIOOrderTypesEnum.LIMIT,
        // [AlunaOrderTypesEnum.MARKET]: GateIOOrderTypesEnum.MARKET,
      },
    })


}
