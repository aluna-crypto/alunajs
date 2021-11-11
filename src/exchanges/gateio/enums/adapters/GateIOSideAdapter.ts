import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { GateIOSideEnum } from '../GateIOSideEnum'



export class GateIOSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<GateIOSideEnum, AlunaSideEnum>({
    errorMessagePrefix: GateIOSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      // TODO implement me

      // [GateIOSideEnum]: AlunaSideEnum.LONG,
      // [GateIOSideEnum]: AlunaSideEnum.SHORT,
    },
  })



  static translateToGateIO = buildAdapter<AlunaSideEnum, GateIOSideEnum>({
    errorMessagePrefix: GateIOSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      // TODO implement me

      // [AlunaSideEnum.LONG]: GateIOSideEnum,
      // [AlunaSideEnum.SHORT]: GateIOSideEnum,
    },
  })



}
