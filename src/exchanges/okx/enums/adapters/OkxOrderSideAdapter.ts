import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { OkxSideEnum } from '../OkxSideEnum'



export class OkxOrderSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<OkxSideEnum, AlunaOrderSideEnum>({
    errorMessagePrefix: OkxOrderSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [OkxSideEnum.LONG]: AlunaOrderSideEnum.BUY,
      [OkxSideEnum.SHORT]: AlunaOrderSideEnum.SELL,
    },
  })



  static translateToOkx =
    buildAdapter<AlunaOrderSideEnum, OkxSideEnum>({
      errorMessagePrefix: OkxOrderSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderSideEnum.BUY]: OkxSideEnum.LONG,
        [AlunaOrderSideEnum.SELL]: OkxSideEnum.SHORT,
      },
    })



}
