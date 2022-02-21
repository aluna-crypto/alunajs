import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'



export class PoloniexSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<PoloniexOrderTypeEnum, AlunaSideEnum>({
    errorMessagePrefix: PoloniexSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [PoloniexOrderTypeEnum.BUY]: AlunaSideEnum.LONG,
      [PoloniexOrderTypeEnum.SELL]: AlunaSideEnum.SHORT,
    },
  })



  static translateToPoloniex =
    buildAdapter<AlunaSideEnum, PoloniexOrderTypeEnum>({
      errorMessagePrefix: PoloniexSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaSideEnum.LONG]: PoloniexOrderTypeEnum.BUY,
        [AlunaSideEnum.SHORT]: PoloniexOrderTypeEnum.SELL,
      },
    })



}
