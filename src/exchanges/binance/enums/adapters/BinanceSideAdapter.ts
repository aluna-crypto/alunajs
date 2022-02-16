import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { BinanceSideEnum } from '../BinanceSideEnum'



export class BinanceSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<BinanceSideEnum, AlunaSideEnum>({
    errorMessagePrefix: BinanceSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [BinanceSideEnum.BUY]: AlunaSideEnum.LONG,
      [BinanceSideEnum.SELL]: AlunaSideEnum.SHORT,
    },
  })



  static translateToBinance = buildAdapter<AlunaSideEnum, BinanceSideEnum>({
    errorMessagePrefix: BinanceSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [AlunaSideEnum.LONG]: BinanceSideEnum.BUY,
      [AlunaSideEnum.SHORT]: BinanceSideEnum.SELL,
    },
  })



}
