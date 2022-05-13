import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { PoloniexOrderStatusEnum } from '../PoloniexOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = buildAdapter<
PoloniexOrderStatusEnum,
AlunaOrderStatusEnum
>({
  errorMessagePrefix,
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

export const translatePoloniexOrderStatus = (params: {
  status?: PoloniexOrderStatusEnum
  startingAmount: string
  amount: string
}): PoloniexOrderStatusEnum => {

  const {
    startingAmount, amount, status,
  } = params

  if (status) {

    return status

  }

  const isPartiallyFilled = parseFloat(startingAmount)
      !== parseFloat(amount)

  if (isPartiallyFilled) {

    return PoloniexOrderStatusEnum.PARTIALLY_FILLED

  }

  return PoloniexOrderStatusEnum.OPEN

}


export const translateOrderStatusToPoloniex = buildAdapter<
  AlunaOrderStatusEnum,
  PoloniexOrderStatusEnum
>({
  errorMessagePrefix,
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
