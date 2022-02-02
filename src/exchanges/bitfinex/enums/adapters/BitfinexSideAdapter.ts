import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'



export class BitfinexSideAdapter {

  static translateToAluna (params: {
    value: number,
  }): AlunaSideEnum {

    const { value } = params

    const side = value > 0
      ? AlunaSideEnum.LONG
      : AlunaSideEnum.SHORT

    return side

  }

  static translateToBitfinex (params: {
    side: AlunaSideEnum,
    amount: number,
  }): number {

    const {
      side,
      amount,
    } = params

    const fixedAmount = side === AlunaSideEnum.LONG
      ? Math.abs(amount)
      : -Math.abs(amount)

    return fixedAmount

  }

}
