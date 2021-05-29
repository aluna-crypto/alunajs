import { OrderStatusEnum } from '@lib/enums/OrderStatusEnum'

import { ValrError } from '../../ValrError'
import { ValrOrderStatusEnum } from '../ValrOrderStatusEnum'



export class ValrStatusAdapter {

  static translateToAluna (params: {
    status: ValrOrderStatusEnum,
  }): OrderStatusEnum {

    const {
      status,
    } = params

    switch (status) {

      case ValrOrderStatusEnum.ACTIVE:
      case ValrOrderStatusEnum.PLACED:
        return OrderStatusEnum.OPEN

      case ValrOrderStatusEnum.PARTIALLY_FILLED:
        return OrderStatusEnum.PARTIALLY_FILLED

      case ValrOrderStatusEnum.FILLED:
        return OrderStatusEnum.FILLED

      case ValrOrderStatusEnum.FAILED:
      case ValrOrderStatusEnum.CANCELLED:
        return OrderStatusEnum.CANCELED

      default:
        throw new ValrError({
          message: `Order side not supported: ${status}`,
        })

    }

  }

  static translateToValr (
    params: {
      status: OrderStatusEnum,
    },
  ): ValrOrderStatusEnum {

    const {
      status,
    } = params

    switch (status) {

      case OrderStatusEnum.OPEN:
        return ValrOrderStatusEnum.PLACED

      case OrderStatusEnum.PARTIALLY_FILLED:
        return ValrOrderStatusEnum.PARTIALLY_FILLED

      case OrderStatusEnum.FILLED:
        return ValrOrderStatusEnum.FILLED

      case OrderStatusEnum.CANCELED:
        return ValrOrderStatusEnum.CANCELLED

      default:
        throw new ValrError({
          message: `Order side not supported: ${status}`,
        })

    }

  }

}
