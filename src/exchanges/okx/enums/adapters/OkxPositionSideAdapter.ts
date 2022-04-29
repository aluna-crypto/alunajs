import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import { OkxPositionSideEnum } from '../OkxPositionSideEnum'



export class OkxPositionSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Position side'



  static translateToAluna =
    buildAdapter<OkxPositionSideEnum, AlunaPositionSideEnum>({
      errorMessagePrefix: OkxPositionSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [OkxPositionSideEnum.LONG]: AlunaPositionSideEnum.LONG,
        [OkxPositionSideEnum.SHORT]: AlunaPositionSideEnum.SHORT,
      },
    })



  static translateToOkx =
    buildAdapter<AlunaPositionSideEnum, OkxPositionSideEnum>({
      errorMessagePrefix: OkxPositionSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaPositionSideEnum.LONG]: OkxPositionSideEnum.LONG,
        [AlunaPositionSideEnum.SHORT]: OkxPositionSideEnum.SHORT,
      },
    })



}
