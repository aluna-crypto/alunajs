import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitmexOrderTypeEnum } from '../BitmexOrderTypeEnum'



export class BitmexOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<BitmexOrderTypeEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: BitmexOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BitmexOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        [BitmexOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
        [BitmexOrderTypeEnum.STOP_MARKET]: AlunaOrderTypesEnum.STOP_MARKET,
        [BitmexOrderTypeEnum.STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
      },
    })


  static translateToBitmex =
    buildAdapter<AlunaOrderTypesEnum, BitmexOrderTypeEnum>({
      errorMessagePrefix: BitmexOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: BitmexOrderTypeEnum.LIMIT,
        [AlunaOrderTypesEnum.MARKET]: BitmexOrderTypeEnum.MARKET,
        [AlunaOrderTypesEnum.STOP_MARKET]: BitmexOrderTypeEnum.STOP_MARKET,
        [AlunaOrderTypesEnum.STOP_LIMIT]: BitmexOrderTypeEnum.STOP_LIMIT,
      },
    })

}

