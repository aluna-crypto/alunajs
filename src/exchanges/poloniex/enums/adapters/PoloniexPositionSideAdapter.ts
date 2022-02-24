import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { PoloniexPositionSideEnum } from '../PoloniexPositionSideEnum'



export class PoloniexPositionSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Position side'



  static translateToAluna =
    buildAdapter<PoloniexPositionSideEnum, AlunaSideEnum>({
      errorMessagePrefix: PoloniexPositionSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [PoloniexPositionSideEnum.LONG]: AlunaSideEnum.LONG,
        [PoloniexPositionSideEnum.SHORT]: AlunaSideEnum.SHORT,
      },
    })



  static translateToPoloniex =
    buildAdapter<AlunaSideEnum, PoloniexPositionSideEnum>({
      errorMessagePrefix: PoloniexPositionSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaSideEnum.LONG]: PoloniexPositionSideEnum.LONG,
        [AlunaSideEnum.SHORT]: PoloniexPositionSideEnum.SHORT,
      },
    })



}
