import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BittrexOrderTypeEnum } from '../BittrexOrderTypeEnum'



export class BittrexOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<BittrexOrderTypeEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: BittrexOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BittrexOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        [BittrexOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
        [BittrexOrderTypeEnum.CEILING_LIMIT]:
          AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
        [BittrexOrderTypeEnum.CEILING_MARKET]:
          AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
      },
    })



  static translateToBittrex =
    buildAdapter<AlunaOrderTypesEnum, BittrexOrderTypeEnum>({
      errorMessagePrefix: BittrexOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: BittrexOrderTypeEnum.LIMIT,
        [AlunaOrderTypesEnum.MARKET]: BittrexOrderTypeEnum.MARKET,
        [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]:
          BittrexOrderTypeEnum.CEILING_LIMIT,
        [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]:
          BittrexOrderTypeEnum.CEILING_MARKET,
      },
    })



}
