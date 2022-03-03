import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'



export class PoloniexSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'


  static translateToAluna =
  (params: { orderType: PoloniexOrderTypeEnum }): AlunaSideEnum => {

    const { orderType } = params

    if (orderType === PoloniexOrderTypeEnum.BUY) {

      return AlunaSideEnum.LONG

    }

    if (orderType === PoloniexOrderTypeEnum.SELL) {

      return AlunaSideEnum.SHORT

    }

    return AlunaSideEnum.LONG

  }

  static translateToPoloniex =
    (params: { side: AlunaSideEnum }): PoloniexOrderTypeEnum => {

      const { side } = params

      if (side === AlunaSideEnum.LONG) {

        return PoloniexOrderTypeEnum.BUY

      }

      if (side === AlunaSideEnum.SHORT) {

        return PoloniexOrderTypeEnum.SELL

      }

      return PoloniexOrderTypeEnum.BUY

    }


    static translateToAlunaOrderType = (): AlunaOrderTypesEnum => {

      // Poloniex only supports LIMIT orders
      return AlunaOrderTypesEnum.LIMIT

    }

}
