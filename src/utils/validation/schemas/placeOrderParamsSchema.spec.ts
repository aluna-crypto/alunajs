import { expect } from 'chai'
import { values } from 'lodash'

import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaOrderPlaceParams } from '../../../lib/modules/authed/IAlunaOrderModule'
import { executeAndCatch } from '../../executeAndCatch'
import { validateParams } from '../validateParams'
import { placeOrderParamsSchema } from './placeOrderParamsSchema'



describe(__filename, () => {

  const params: IAlunaOrderPlaceParams = {
    symbolPair: 'XBTUSD',
    account: AlunaAccountEnum.DERIVATIVES,
    amount: 100,
    side: AlunaOrderSideEnum.BUY,
    type: AlunaOrderTypesEnum.LIMIT,
    rate: 10,
  }

  it("should ensure 'symbolPair' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.symbolPair

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"symbolPair" is required')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)


    modifiedParams.symbolPair = 8

    executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"symbolPair" must be a string')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

  it("should ensure 'account' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.account

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"account" is required')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)


    modifiedParams.account = 8

    executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    const msg = '"account" must be one of [exchange, margin, derivatives, '
      .concat('lending]')

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq(msg)
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

  it("should ensure 'amount' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.amount

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"amount" is required')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)


    modifiedParams.amount = 'abc'

    executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"amount" must be a number')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

  it("should ensure 'side' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.side

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"side" is required')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)


    modifiedParams.side = 'abc'

    executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    const msg = '"side" must be one of '
      .concat(`[${values(AlunaOrderSideEnum).join(', ')}]`)

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq(msg)
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

  it("should ensure 'type' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.type

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"type" is required')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)


    modifiedParams.type = 'abc'

    executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    const msg = '"type" must be one of '
      .concat(`[${values(AlunaOrderTypesEnum).join(', ')}]`)

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq(msg)
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

  it("should ensure 'rate' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    modifiedParams.rate = 'abc'
    modifiedParams.type = AlunaOrderTypesEnum.LIMIT

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"rate" must be a number')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)


    delete modifiedParams.rate

    executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"rate" is required')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

  it("should ensure 'stopRate' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.rate
    modifiedParams.stopRate = 'abc'
    modifiedParams.type = AlunaOrderTypesEnum.STOP_MARKET

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"stopRate" must be a number')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)


    delete modifiedParams.stopRate

    executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"stopRate" is required')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

  it("should ensure 'limitRate' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.rate
    modifiedParams.stopRate = 90
    modifiedParams.limitRate = 'abc'
    modifiedParams.type = AlunaOrderTypesEnum.STOP_LIMIT

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"limitRate" must be a number')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)


    delete modifiedParams.limitRate

    executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: placeOrderParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq('"limitRate" is required')
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

})
