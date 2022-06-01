import { debug } from 'debug'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaAccountsErrorCodes } from '../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaOrderErrorCodes } from '../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderPlaceParams } from '../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaExchangeSchema } from '../../lib/schemas/IAlunaExchangeSchema'



const log = debug('alunajs:utils/order/ensureOrderIsSupported')



export interface IEnsureOrderIsSupportedParams {
  orderPlaceParams: IAlunaOrderPlaceParams
  exchangeSpecs: IAlunaExchangeSchema
}



export const ensureOrderIsSupported = (
  params: IEnsureOrderIsSupportedParams,
): void => {

  const {
    exchangeSpecs,
    orderPlaceParams: {
      // amount,
      // rate,
      // symbolPair,
      // side,
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

    const { name } = exchangeSpecs

    const {
      supported,
      implemented,
      orderTypes,
    } = accountSpecs

    if (!supported || !implemented) {

      message = `Account type '${account}' not implemented for ${name}`

      throw new AlunaError({
        message,
        code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
      })

    }

    const orderType = orderTypes.find((o) => o.type === type)

    if (!orderType || !orderType.implemented) {

      message = `Order type '${type}' not implemented for ${name}`

      throw new AlunaError({
        message,
        code: AlunaOrderErrorCodes.TYPE_NOT_SUPPORTED,
      })

    }

  } catch (error) {

    log(error)

    throw error

  }

}
