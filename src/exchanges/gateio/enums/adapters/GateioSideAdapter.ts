import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { BinanceSideEnum } from '../BinanceSideEnum'



export class GateioSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<GateioSideEnum, AlunaSideEnum>({
    errorMessagePrefix: GateioSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      // TODO implement me

      // [GateioSideEnum]: AlunaSideEnum.LONG,
      // [GateioSideEnum]: AlunaSideEnum.SHORT,
    },
  })



  static translateToGateio = buildAdapter<AlunaSideEnum, GateioSideEnum>({
    errorMessagePrefix: GateioSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      // TODO implement me

      // [AlunaSideEnum.LONG]: GateioSideEnum,
      // [AlunaSideEnum.SHORT]: GateioSideEnum,
    },
  })



}
