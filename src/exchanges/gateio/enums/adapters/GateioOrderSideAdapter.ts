import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { GateioSideEnum } from '../GateioSideEnum'



export class GateioOrderSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<GateioSideEnum, AlunaOrderSideEnum>({
    errorMessagePrefix: GateioOrderSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [GateioSideEnum.BUY]: AlunaOrderSideEnum.BUY,
      [GateioSideEnum.SELL]: AlunaOrderSideEnum.SELL,
    },
  })



  static translateToGateio = buildAdapter<AlunaOrderSideEnum, GateioSideEnum>({
    errorMessagePrefix: GateioOrderSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [AlunaOrderSideEnum.BUY]: GateioSideEnum.BUY,
      [AlunaOrderSideEnum.SELL]: GateioSideEnum.SELL,
    },
  })



}
