import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'



export class PoloniexOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<PoloniexOrderTypeEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: PoloniexOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [PoloniexOrderTypeEnum.BUY]: AlunaOrderTypesEnum.LIMIT,
        [PoloniexOrderTypeEnum.SELL]: AlunaOrderTypesEnum.LIMIT,
      },
    })



  static translateToPoloniex =
    buildAdapter<AlunaSideEnum, PoloniexOrderTypeEnum>({
      errorMessagePrefix: PoloniexOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaSideEnum.LONG]: PoloniexOrderTypeEnum.BUY,
        [AlunaSideEnum.SHORT]: PoloniexOrderTypeEnum.SELL,
      },
    })



}
