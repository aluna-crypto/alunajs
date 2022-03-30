import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { FtxSideEnum } from '../FtxSideEnum'



export class FtxSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<FtxSideEnum, AlunaOrderSideEnum>({
    errorMessagePrefix: FtxSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [FtxSideEnum.BUY]: AlunaOrderSideEnum.BUY,
      [FtxSideEnum.SELL]: AlunaOrderSideEnum.SELL,
    },
  })



  static translateToFtx = buildAdapter<AlunaOrderSideEnum, FtxSideEnum>({
    errorMessagePrefix: FtxSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [AlunaOrderSideEnum.BUY]: FtxSideEnum.BUY,
      [AlunaOrderSideEnum.SELL]: FtxSideEnum.SELL,
    },
  })



}
