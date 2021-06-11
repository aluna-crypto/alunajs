import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { ValrOrderTypesEnum } from '../ValrOrderTypesEnum'



export class ValrOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<ValrOrderTypesEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: ValrOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [ValrOrderTypesEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        [ValrOrderTypesEnum.LIMIT_POST_ONLY]: AlunaOrderTypesEnum.LIMIT,
        [ValrOrderTypesEnum.STOP_LOSS_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
        [ValrOrderTypesEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
        [ValrOrderTypesEnum.SIMPLE]: AlunaOrderTypesEnum.MARKET,
        [ValrOrderTypesEnum.TAKE_PROFIT_LIMIT]:
          AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT,
      },
    })



  static translateToValr =
    buildAdapter<AlunaOrderTypesEnum, ValrOrderTypesEnum>({
      errorMessagePrefix: ValrOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: ValrOrderTypesEnum.LIMIT,
        [AlunaOrderTypesEnum.MARKET]: ValrOrderTypesEnum.MARKET,
        [AlunaOrderTypesEnum.STOP_LIMIT]: ValrOrderTypesEnum.STOP_LOSS_LIMIT,
        [AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT]:
          ValrOrderTypesEnum.TAKE_PROFIT_LIMIT,
      },
    })



}
