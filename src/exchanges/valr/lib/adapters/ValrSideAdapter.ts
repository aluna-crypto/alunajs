import { SideEnum } from '@lib/enums/SideEnum'

import { ValrSideEnum } from '../enums/ValrSideEnum'
import { ValrError } from '../errors/ValrError'



export class ValrSideAdapter {

  static translateToAluna (
    params: {
      side: ValrSideEnum
    },
  ): SideEnum {

    const {
      side,
    } = params

    switch (side) {

      case ValrSideEnum.BUY:
        return SideEnum.LONG

      case ValrSideEnum.SELL:
        return SideEnum.SHORT

      default:
        throw new ValrError({
          message: `Order side not supported: ${side}`,
        })

    }

  }

  static translateToValr (
    params: {
      side: SideEnum
    },
  ): ValrSideEnum {

    const {
      side,
    } = params

    switch (side) {

      case SideEnum.LONG:
        return ValrSideEnum.BUY

      case SideEnum.SHORT:
        return ValrSideEnum.SELL

      default:
        throw new ValrError({
          message: `Order side not supported: ${side}`,
        })

    }

  }

}
