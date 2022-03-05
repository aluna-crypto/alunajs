import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'



export class PoloniexOrderSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'


  static translateToAluna =
  (params: { orderType: PoloniexOrderTypeEnum }): AlunaOrderSideEnum => {

    const { orderType } = params

    if (orderType === PoloniexOrderTypeEnum.BUY) {

      return AlunaOrderSideEnum.BUY

    }

    if (orderType === PoloniexOrderTypeEnum.SELL) {

      return AlunaOrderSideEnum.SELL

    }

    return AlunaOrderSideEnum.BUY

  }

  static translateToPoloniex =
    (params: { side: AlunaOrderSideEnum }): PoloniexOrderTypeEnum => {

      const { side } = params

      if (side === AlunaOrderSideEnum.BUY) {

        return PoloniexOrderTypeEnum.BUY

      }

      if (side === AlunaOrderSideEnum.SELL) {

        return PoloniexOrderTypeEnum.SELL

      }

      return PoloniexOrderTypeEnum.BUY

    }


    static translateToAlunaOrderType = (): AlunaOrderTypesEnum => {

      // Poloniex only supports LIMIT orders
      return AlunaOrderTypesEnum.LIMIT

    }

}
