import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { ValrSideEnum } from '../ValrSideEnum'



export class ValrSideAdapter {

  static readonly ERROR_MESSAGE_PREFIX = 'Order side'

  static translateToAluna = buildAdapter<ValrSideEnum, AlunaSideEnum>({
    errorMessagePrefix: ValrSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [ValrSideEnum.BUY]: AlunaSideEnum.LONG,
      [ValrSideEnum.SELL]: AlunaSideEnum.SHORT,
    },
  })

  static translateToValr = buildAdapter<AlunaSideEnum, ValrSideEnum>({
    errorMessagePrefix: ValrSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [AlunaSideEnum.LONG]: ValrSideEnum.BUY,
      [AlunaSideEnum.SHORT]: ValrSideEnum.SELL,
    },
  })

}
