import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { GateioSideEnum } from '../GateioSideEnum'



export class GateioSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<GateioSideEnum, AlunaSideEnum>({
    errorMessagePrefix: GateioSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [GateioSideEnum.BUY]: AlunaSideEnum.LONG,
      [GateioSideEnum.SELL]: AlunaSideEnum.SHORT,
    },
  })



  static translateToGateio = buildAdapter<AlunaSideEnum, GateioSideEnum>({
    errorMessagePrefix: GateioSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [AlunaSideEnum.LONG]: GateioSideEnum.BUY,
      [AlunaSideEnum.SHORT]: GateioSideEnum.SELL,
    },
  })



}
