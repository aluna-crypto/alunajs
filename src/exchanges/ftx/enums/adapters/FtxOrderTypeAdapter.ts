import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { FtxOrderTypeEnum } from '../FtxOrderTypeEnum'



export class FtxOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<FtxOrderTypeEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: FtxOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [FtxOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        [FtxOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
      },
    })



  static translateToFtx =
    buildAdapter<AlunaOrderTypesEnum, FtxOrderTypeEnum>({
      errorMessagePrefix: FtxOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: FtxOrderTypeEnum.LIMIT,
        [AlunaOrderTypesEnum.MARKET]: FtxOrderTypeEnum.MARKET,
      },
    })



}
