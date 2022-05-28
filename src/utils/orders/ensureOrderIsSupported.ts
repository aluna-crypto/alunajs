import { debug } from 'debug'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaAccountsErrorCodes } from '../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaOrderErrorCodes } from '../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderEditParams,
  IAlunaOrderPlaceParams,
} from '../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaExchangeSchema } from '../../lib/schemas/IAlunaExchangeSchema'



const log = debug('alunajs:utils/order/ensureOrderIsSupported')



export interface IEnsureOrderIsSupportedParams {
  orderParams: IAlunaOrderPlaceParams | IAlunaOrderEditParams
  exchangeSpecs: IAlunaExchangeSchema
}



export const ensureOrderIsSupported = (
  params: IEnsureOrderIsSupportedParams,
): void => {

  const {
    exchangeSpecs,
    orderParams: {
      type,
      account,
    },
  } = params

  try {

    let message: string

    const accountSpecs = exchangeSpecs.accounts.find((a) => {
      return a.type === account
    })

    if (!accountSpecs) {

      throw new AlunaError({
        message: `Account type '${account}' not found`,
        code: AlunaAccountsErrorCodes.TYPE_NOT_FOUND,
      })

    }

    const {
      supported,
      implemented,
      orderTypes,
    } = accountSpecs

    if (!supported || !implemented) {

      message = `Account type '${account}' not supported/implemented `
        .concat(`for ${exchangeSpecs.name}`)

      throw new AlunaError({
        message,
        code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
      })

    }

    const orderType = orderTypes.find((o) => o.type === type)

    if (!orderType || !orderType.implemented || !orderType.supported) {

      message = `Order type '${type}' not supported/implemented for `
        .concat(`${exchangeSpecs.name}`)

      throw new AlunaError({
        message,
        code: AlunaOrderErrorCodes.TYPE_NOT_SUPPORTED,
      })

    }

    if (orderType.mode === AlunaFeaturesModeEnum.READ) {

      throw new AlunaError({
        message: `Order type '${type}' is in read mode`,
        code: AlunaOrderErrorCodes.TYPE_IS_READ_ONLY,
      })

    }

  } catch (error) {

    log(error)

    throw error

  }
}
