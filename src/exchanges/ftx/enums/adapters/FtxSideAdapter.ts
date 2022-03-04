import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { FtxSideEnum } from '../FtxSideEnum'



export class FtxSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<FtxSideEnum, AlunaSideEnum>({
    errorMessagePrefix: FtxSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [FtxSideEnum.BUY]: AlunaSideEnum.LONG,
      [FtxSideEnum.SELL]: AlunaSideEnum.SHORT,
    },
  })



  static translateToFtx = buildAdapter<AlunaSideEnum, FtxSideEnum>({
    errorMessagePrefix: FtxSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [AlunaSideEnum.LONG]: FtxSideEnum.BUY,
      [AlunaSideEnum.SHORT]: FtxSideEnum.SELL,
    },
  })



}
