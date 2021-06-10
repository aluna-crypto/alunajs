import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { OrderStatusEnum } from '../../../../lib/enums/OrderStatusEnum'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'



export class ValrStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna = buildAdapter<ValrOrderStatusEnum, OrderStatusEnum>({
    errorMessagePrefix: ValrStatusAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [ValrOrderStatusEnum.ACTIVE]: OrderStatusEnum.OPEN,
      [ValrOrderStatusEnum.PLACED]: OrderStatusEnum.OPEN,
      [ValrOrderStatusEnum.PARTIALLY_FILLED]: OrderStatusEnum.PARTIALLY_FILLED,
      [ValrOrderStatusEnum.FILLED]: OrderStatusEnum.FILLED,
      [ValrOrderStatusEnum.FAILED]: OrderStatusEnum.CANCELED,
      [ValrOrderStatusEnum.CANCELLED]: OrderStatusEnum.CANCELED,
    },
  })



  static translateToValr = buildAdapter<OrderStatusEnum, ValrOrderStatusEnum>({
    errorMessagePrefix: ValrStatusAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [OrderStatusEnum.OPEN]: ValrOrderStatusEnum.PLACED,
      [OrderStatusEnum.PARTIALLY_FILLED]: ValrOrderStatusEnum.PARTIALLY_FILLED,
      [OrderStatusEnum.FILLED]: ValrOrderStatusEnum.FILLED,
      [OrderStatusEnum.CANCELED]: ValrOrderStatusEnum.CANCELLED,
    },
  })



}

