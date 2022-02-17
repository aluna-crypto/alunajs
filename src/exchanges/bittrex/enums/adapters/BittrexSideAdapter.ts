import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { BittrexSideEnum } from '../BittrexSideEnum'



export class BittrexSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<BittrexSideEnum, AlunaSideEnum>({
    errorMessagePrefix: BittrexSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [BittrexSideEnum.BUY]: AlunaSideEnum.LONG,
      [BittrexSideEnum.SELL]: AlunaSideEnum.SHORT,
    },
  })



  static translateToBittrex = buildAdapter<AlunaSideEnum, BittrexSideEnum>({
    errorMessagePrefix: BittrexSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [AlunaSideEnum.LONG]: BittrexSideEnum.BUY,
      [AlunaSideEnum.SHORT]: BittrexSideEnum.SELL,
    },
  })



}
