import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { OkxOrderTypeEnum } from '../OkxOrderTypeEnum'



export class OkxOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<OkxOrderTypeEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: OkxOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [OkxOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        [OkxOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
      },
    })



  static translateToOkx =
    buildAdapter<AlunaOrderTypesEnum, OkxOrderTypeEnum>({
      errorMessagePrefix: OkxOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: OkxOrderTypeEnum.LIMIT,
        [AlunaOrderTypesEnum.MARKET]: OkxOrderTypeEnum.MARKET,
      },
    })



}
