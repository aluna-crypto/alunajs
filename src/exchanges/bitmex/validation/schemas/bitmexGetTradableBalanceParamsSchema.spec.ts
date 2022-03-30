import { expect } from 'chai'

import { AlunaGenericErrorCodes } from '../../../../lib/errors/AlunaGenericErrorCodes'
import { IAlunaOrderPlaceParams } from '../../../../lib/modules/IAlunaOrderModule'
import { executeAndCatch } from '../../../../utils/executeAndCatch'
import { placeOrderParamsSchema } from '../../../../utils/validation/schemas/placeOrderParamsSchema'
import { validateParams } from '../../../../utils/validation/validateParams'
import { bitmexGetTradableBalanceParamsSchema } from './bitmexGetTradableBalanceParamsSchema'



describe('bitmexGetTradableBalanceParamsSchema', () => {

  it("should ensure 'symbolPair' is properly validated", async () => {

    const modifiedParams = {} as any

    delete modifiedParams.symbolPair

    let executeRes = await executeAndCatch(
      async () => validateParams({
        params: modifiedParams as IAlunaOrderPlaceParams,
        schema: bitmexGetTradableBalanceParamsSchema,
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

})
