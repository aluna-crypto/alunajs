import { expect } from 'chai'

import { AlunaGenericErrorCodes } from '../../lib/errors/AlunaGenericErrorCodes'
import { executeAndCatch } from '../executeAndCatch'
import { validateParams } from './validateParams'



describe(__filename, () => {

  it('should properly validate params', () => {

    const params = { symbol: 'AAA' }

    const schema = {
      validate: () => ({ value: params }),
    } as any

    const validParams = validateParams({
      params,
      schema,
    })

    expect(validParams).to.deep.eq(params)

  })

  it('should throw error if schema validation fails', async () => {

    const params = { symbol: 666 }

    const errorMessage = '"symbol" must be a string'

    const schema = {
      validate: () => ({
        value: params,
        error: { message: errorMessage },
      }),
    } as any

    const {
      error,
      result,
    } = await executeAndCatch(() => validateParams({
      params,
      schema,
    }))

    expect(result).not.to.be.ok

    expect(error?.code).to.be.eq(AlunaGenericErrorCodes.PARAM_ERROR)
    expect(error?.message).to.be.eq(errorMessage)

  })

})
