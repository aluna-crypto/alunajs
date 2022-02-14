import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'



export class BitfinexSideAdapter {

  static translateToAluna (params: {
    amount: number,
  }): AlunaSideEnum {

    const { amount } = params

    const side = Number(amount) > 0
      ? AlunaSideEnum.LONG
      : AlunaSideEnum.SHORT

    return side

  }

  static translateToBitfinex (params: {
    side: AlunaSideEnum,
    amount: number | string,
  }): string {

    const {
      side,
      amount,
    } = params

    const fixedAmount = side === AlunaSideEnum.LONG
      ? Math.abs(Number(amount))
      : -Math.abs(Number(amount))

    return fixedAmount.toString()

  }

}
