import { OrderTypesEnum } from '@lib/enums/OrderTypeEnum'

import { ValrOrderTypesEnum } from '../ValrOrderTypesEnum'
import { ValrError } from '../../ValrError'



export class ValrOrderTypeAdapter {

  static translateToAluna (
    params: {
      type: ValrOrderTypesEnum,
    },
  ): OrderTypesEnum {

    const {
      type,
    } = params

    switch (type) {

      case ValrOrderTypesEnum.LIMIT:
      case ValrOrderTypesEnum.LIMIT_POST_ONLY:
        return OrderTypesEnum.LIMIT

      case ValrOrderTypesEnum.STOP_LOSS_LIMIT:
        return OrderTypesEnum.STOP_LIMIT

      case ValrOrderTypesEnum.MARKET:
      case ValrOrderTypesEnum.SIMPLE:
        return OrderTypesEnum.MARKET

      case ValrOrderTypesEnum.TAKE_PROFIT_LIMIT:
        return OrderTypesEnum.TAKE_PROFIT_LIMIT

      default:
        throw new ValrError({
          message: `Order type not supported: ${type}`,
        })

    }

  }

  static translateToValr (
    params: {
      type: OrderTypesEnum,
    },
  ): ValrOrderTypesEnum {

    const {
      type,
    } = params

    switch (type) {

      case OrderTypesEnum.LIMIT:
        return ValrOrderTypesEnum.LIMIT

      case OrderTypesEnum.MARKET:
        return ValrOrderTypesEnum.MARKET

      case OrderTypesEnum.STOP_LIMIT:
        return ValrOrderTypesEnum.STOP_LOSS_LIMIT

      case OrderTypesEnum.TAKE_PROFIT_LIMIT:
        return ValrOrderTypesEnum.TAKE_PROFIT_LIMIT


      default:
        throw new ValrError({
          message: `Order type not supported: ${type}`,
        })

    }

  }

}
