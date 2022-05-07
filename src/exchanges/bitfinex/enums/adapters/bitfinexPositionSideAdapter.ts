import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'



export const translatePositionSideToAluna = (params: {
  amount: number
}): AlunaPositionSideEnum => {

  const { amount } = params

  const side = Number(amount) > 0
    ? AlunaPositionSideEnum.LONG
    : AlunaPositionSideEnum.SHORT

  return side

}



export const translatePositionSideToBitfinex = (params: {
  side: AlunaPositionSideEnum
  amount: number | string
}): string => {

  const {
    side,
    amount,
  } = params

  const fixedAmount = side === AlunaPositionSideEnum.LONG
    ? Math.abs(Number(amount))
    : -Math.abs(Number(amount))

  return fixedAmount.toString()

}
