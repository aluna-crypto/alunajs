import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { BitmexSideEnum } from '../BitmexSideEnum'



export class BitmexSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Side'



  static translateToAluna =
    buildAdapter<BitmexSideEnum, AlunaSideEnum>({
      errorMessagePrefix: BitmexSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BitmexSideEnum.BUY]: AlunaSideEnum.LONG,
        [BitmexSideEnum.SELL]: AlunaSideEnum.SHORT,
      },
    })


  static translateToBitmex =
    buildAdapter<AlunaSideEnum, BitmexSideEnum>({
      errorMessagePrefix: BitmexSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaSideEnum.LONG]: BitmexSideEnum.BUY,
        [AlunaSideEnum.SHORT]: BitmexSideEnum.SELL,
      },
    })

}

