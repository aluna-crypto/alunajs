import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { OrderTypesEnum } from '../../../../lib/enums/OrderTypeEnum'
import { ValrOrderTypesEnum } from '../ValrOrderTypesEnum'



export class ValrOrderTypeAdapter {



  static readonly ERROR_PREFIX = 'Order type'



  static translateToAluna = buildAdapter<ValrOrderTypesEnum, OrderTypesEnum>({
    prefix: ValrOrderTypeAdapter.ERROR_PREFIX,
    mappings: {
      [ValrOrderTypesEnum.LIMIT]: OrderTypesEnum.LIMIT,
      [ValrOrderTypesEnum.LIMIT_POST_ONLY]: OrderTypesEnum.LIMIT,
      [ValrOrderTypesEnum.STOP_LOSS_LIMIT]: OrderTypesEnum.STOP_LIMIT,
      [ValrOrderTypesEnum.MARKET]: OrderTypesEnum.MARKET,
      [ValrOrderTypesEnum.SIMPLE]: OrderTypesEnum.MARKET,
      [ValrOrderTypesEnum.TAKE_PROFIT_LIMIT]: OrderTypesEnum.TAKE_PROFIT_LIMIT,
    },
  })



  static translateToValr = buildAdapter<OrderTypesEnum, ValrOrderTypesEnum>({
    prefix: ValrOrderTypeAdapter.ERROR_PREFIX,
    mappings: {
      [OrderTypesEnum.LIMIT]: ValrOrderTypesEnum.LIMIT,
      [OrderTypesEnum.MARKET]: ValrOrderTypesEnum.MARKET,
      [OrderTypesEnum.STOP_LIMIT]: ValrOrderTypesEnum.STOP_LOSS_LIMIT,
      [OrderTypesEnum.TAKE_PROFIT_LIMIT]: ValrOrderTypesEnum.TAKE_PROFIT_LIMIT,
    },
  })



}
