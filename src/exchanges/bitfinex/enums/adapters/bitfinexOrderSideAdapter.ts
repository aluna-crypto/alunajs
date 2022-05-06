import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'



export const translateOrderSideToAluna = (params: {
  amount: number
}): AlunaOrderSideEnum => {

  const { amount } = params

  const side = Number(amount) > 0
    ? AlunaOrderSideEnum.BUY
    : AlunaOrderSideEnum.SELL

  return side

}



export const translateOrderSideToBitfinex = (params: {
  side: AlunaOrderSideEnum
  amount: number | string
}): string => {

  const {
    side,
    amount,
  } = params

  const fixedAmount = side === AlunaOrderSideEnum.BUY
    ? Math.abs(Number(amount))
    : -Math.abs(Number(amount))

  return fixedAmount.toString()

}
