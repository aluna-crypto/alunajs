import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import { BitmexSideEnum } from '../BitmexSideEnum'



export class BitmexPositionSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Side'



  static translateToAluna (params: {
    homeNotional: number,
  }): AlunaPositionSideEnum {

    const { homeNotional } = params

    if (homeNotional < 0) {

      return AlunaPositionSideEnum.SHORT

    }

    return AlunaPositionSideEnum.LONG

  }


  static translateToBitmex =
    buildAdapter<AlunaPositionSideEnum, BitmexSideEnum>({
      errorMessagePrefix: BitmexPositionSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaPositionSideEnum.LONG]: BitmexSideEnum.BUY,
        [AlunaPositionSideEnum.SHORT]: BitmexSideEnum.SELL,
      },
    })

}

