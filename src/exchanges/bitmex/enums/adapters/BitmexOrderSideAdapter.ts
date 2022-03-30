import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BitmexSideEnum } from '../BitmexSideEnum'



export class BitmexOrderSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Side'



  static translateToAluna =
    buildAdapter<BitmexSideEnum, AlunaOrderSideEnum>({
      errorMessagePrefix: BitmexOrderSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BitmexSideEnum.BUY]: AlunaOrderSideEnum.BUY,
        [BitmexSideEnum.SELL]: AlunaOrderSideEnum.SELL,
      },
    })


  static translateToBitmex =
    buildAdapter<AlunaOrderSideEnum, BitmexSideEnum>({
      errorMessagePrefix: BitmexOrderSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderSideEnum.BUY]: BitmexSideEnum.BUY,
        [AlunaOrderSideEnum.SELL]: BitmexSideEnum.SELL,
      },
    })

}

