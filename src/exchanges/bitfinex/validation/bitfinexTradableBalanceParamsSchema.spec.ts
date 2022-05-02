import { expect } from 'chai'
import { values } from 'lodash'

import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaBalanceGetTradableBalanceParams } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaOrderPlaceParams } from '../../../lib/modules/IAlunaOrderModule'
import { executeAndCatch } from '../../../utils/executeAndCatch'
import { validateParams } from '../../../utils/validation/validateParams'
import { bitfinexGetTradableBalanceParamsSchema } from './bitfinexTradableBalanceParamsSchema'



describe('bitfinexTradableBalanceParamsSchema', () => {

  const params: IAlunaBalanceGetTradableBalanceParams = {
    symbolPair: 'tBTCETH',
    account: AlunaAccountEnum.DERIVATIVES,
    side: AlunaOrderSideEnum.BUY,
    rate: 10,
  }

  it("should ensure 'symbolPair' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.symbolPair

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: bitfinexGetTradableBalanceParamsSchema,
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
        schema: bitfinexGetTradableBalanceParamsSchema,
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
        schema: bitfinexGetTradableBalanceParamsSchema,
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
        schema: bitfinexGetTradableBalanceParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    const msg = '"account" must be one of [exchange, margin, derivatives, '
      .concat('lending, main]')

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq(msg)
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

  it("should ensure 'side' is properly validated", async () => {

    const modifiedParams = { ...params } as any

    delete modifiedParams.side

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: bitfinexGetTradableBalanceParamsSchema,
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
        schema: bitfinexGetTradableBalanceParamsSchema,
      }),
    )

    expect(executeRes.result).not.to.be.ok

    const msg = '"side" must be one of '
      .concat(`[${values(AlunaOrderSideEnum).join(', ')}]`)

    expect(executeRes.error!.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(executeRes.error!.message).to.be.eq(msg)
    expect(executeRes.error!.httpStatusCode).to.be.eq(400)

  })

})
