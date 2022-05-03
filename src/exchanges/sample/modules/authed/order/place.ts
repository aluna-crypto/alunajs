import { debug } from 'debug'
import { assign } from 'lodash'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaFeaturesModeEnum } from '../../../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaAccountsErrorCodes } from '../../../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderPlaceReturns,
} from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { placeOrderParamsSchema } from '../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../../utils/validation/validateParams'
import { SampleHttp } from '../../../SampleHttp'
import {
  SAMPLE_PRODUCTION_URL,
  sampleBaseSpecs,
} from '../../../sampleSpecs'
import { translateOrderSideToSample } from '../../../enums/adapters/sampleOrderSideAdapter'
import { translateOrderTypeToSample } from '../../../enums/adapters/sampleOrderTypeAdapter'
import { SampleOrderTimeInForceEnum } from '../../../enums/SampleOrderTimeInForceEnum'
import { SampleOrderTypeEnum } from '../../../enums/SampleOrderTypeEnum'
import { ISampleOrderSchema } from '../../../schemas/ISampleOrderSchema'



const log = debug('@aluna.js:sample/order/place')



export const place = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaOrderPlaceParams,
): Promise<IAlunaOrderPlaceReturns> => {

  log('params', params)

  const { credentials } = exchange

  validateParams({
    params,
    schema: placeOrderParamsSchema,
  })

  const {
    amount,
    rate,
    symbolPair,
    side,
    type,
    account,
    http = new SampleHttp(),
  } = params

  try {

    const accountSpecs = sampleBaseSpecs.accounts.find((a) => {
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

      throw new AlunaError({
        message:
            `Account type '${account}' not supported/implemented for Sample`,
        code: AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED,
      })

    }

    const orderType = orderTypes.find((o) => o.type === type)

    if (!orderType || !orderType.implemented || !orderType.supported) {

      throw new AlunaError({
        message: `Order type '${type}' not supported/implemented for Sample`,
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

  const translatedOrderType = translateOrderTypeToSample({
    from: type,
  })

  const body = {
    direction: translateOrderSideToSample({ from: side }),
    marketSymbol: symbolPair,
    type: translatedOrderType,
    quantity: Number(amount),
  }

  if (translatedOrderType === SampleOrderTypeEnum.LIMIT) {

    assign(body, {
      limit: Number(rate),
      timeInForce: SampleOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    })

  } else {

    assign(body, {
      timeInForce: SampleOrderTimeInForceEnum.FILL_OR_KILL,
    })

  }

  log('placing new order for Sample')

  let placedOrder: ISampleOrderSchema

  try {

    const orderResponse = await http.authedRequest<ISampleOrderSchema>({
      url: `${SAMPLE_PRODUCTION_URL}/orders`,
      body,
      credentials,
    })

    placedOrder = orderResponse

  } catch (err) {

    let {
      code,
      message,
    } = err

    const { metadata } = err

    if (metadata.code === 'INSUFFICIENT_FUNDS') {

      code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      message = 'Account has insufficient balance for requested action.'

    } else if (metadata.code === 'DUST_TRADE_DISALLOWED_MIN_VALUE') {

      code = AlunaGenericErrorCodes.UNKNOWN

      message = 'The amount of quote currency involved in a transaction '
        .concat('would be less than the minimum limit of 10K satoshis')

    } else if (metadata.code === 'MIN_TRADE_REQUIREMENT_NOT_MET') {

      code = AlunaOrderErrorCodes.PLACE_FAILED

      message = 'The trade was smaller than the min trade size quantity for '
        .concat('the market')

    }

    throw new AlunaError({
      ...err,
      code,
      message,
    })

  }

  const { order } = exchange.order.parse({ rawOrder: placedOrder })

  const { requestCount } = http

  return {
    order,
    requestCount,
  }

}
