import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'



export class BitfinexSideAdapter {

  static translateToAluna (params: {
    value: number | string,
  }): AlunaSideEnum {

    const { value } = params

    const side = Number(value) > 0
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
