import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { PoloniexOrderStatusEnum } from '../PoloniexOrderStatusEnum'



export class PoloniexStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<PoloniexOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: PoloniexStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [PoloniexOrderStatusEnum.OPEN]: AlunaOrderStatusEnum.OPEN,
        [PoloniexOrderStatusEnum.PARTIALLY_FILLED]:
          AlunaOrderStatusEnum.PARTIALLY_FILLED,
        [PoloniexOrderStatusEnum.FILLED]:
          AlunaOrderStatusEnum.FILLED,
        [PoloniexOrderStatusEnum.CANCELED]:
          AlunaOrderStatusEnum.CANCELED,
      },
    })



    static translatePoloniexStatus = (params: {
      status?: PoloniexOrderStatusEnum,
      startingAmount: string,
      amount: string,
      isFilled: boolean,
    }): PoloniexOrderStatusEnum => {

      const {
        startingAmount, amount, isFilled, status,
      } = params

      if (status) {

        return status

      }

      if (isFilled) {

        return PoloniexOrderStatusEnum.FILLED

      }

      const isPartiallyFilled = parseFloat(startingAmount)
          !== parseFloat(amount)

      if (isPartiallyFilled) {

        return PoloniexOrderStatusEnum.PARTIALLY_FILLED

      }

      return PoloniexOrderStatusEnum.OPEN

    }



  static translateToPoloniex =
    buildAdapter<AlunaOrderStatusEnum, PoloniexOrderStatusEnum>({
      errorMessagePrefix: PoloniexStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: PoloniexOrderStatusEnum.OPEN,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          PoloniexOrderStatusEnum.PARTIALLY_FILLED,
        [AlunaOrderStatusEnum.CANCELED]:
          PoloniexOrderStatusEnum.CANCELED,
        [AlunaOrderStatusEnum.FILLED]:
          PoloniexOrderStatusEnum.FILLED,
      },
    })



}

