import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BittrexSideEnum } from '../BittrexSideEnum'



export class BittrexOrderSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<BittrexSideEnum, AlunaOrderSideEnum>({
    errorMessagePrefix: BittrexOrderSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [BittrexSideEnum.BUY]: AlunaOrderSideEnum.BUY,
      [BittrexSideEnum.SELL]: AlunaOrderSideEnum.SELL,
    },
  })



  static translateToBittrex =
    buildAdapter<AlunaOrderSideEnum, BittrexSideEnum>({
      errorMessagePrefix: BittrexOrderSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderSideEnum.BUY]: BittrexSideEnum.BUY,
        [AlunaOrderSideEnum.SELL]: BittrexSideEnum.SELL,
      },
    })



}
