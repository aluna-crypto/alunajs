import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'



export class BitfinexPositionSideAdapter {

  static translateToAluna (params: {
    amount: number,
  }): AlunaPositionSideEnum {

    const { amount } = params

    const side = Number(amount) > 0
      ? AlunaPositionSideEnum.LONG
      : AlunaPositionSideEnum.SHORT

    return side

  }

  static translateToBitfinex (params: {
    side: AlunaPositionSideEnum,
    amount: number | string,
  }): string {

    const {
      side,
      amount,
    } = params

    const fixedAmount = side === AlunaPositionSideEnum.LONG
      ? Math.abs(Number(amount))
      : -Math.abs(Number(amount))

    return fixedAmount.toString()

  }

}
