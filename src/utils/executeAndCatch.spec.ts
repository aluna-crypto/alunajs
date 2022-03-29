import { expect } from 'chai'

import { AlunaError } from '../lib/core/AlunaError'
import { AlunaGenericErrorCodes } from '../lib/errors/AlunaGenericErrorCodes'
import { executeAndCatch } from './executeAndCatch'



describe('executeAndCatch', () => {

  it('should properly execute lambda function and return result', async () => {

    const dummyValue = 10
    const dummyFunction = async () => Promise.resolve(dummyValue)

    const {
      error,
      result,
    } = await executeAndCatch(async () => dummyFunction())

    expect(result).to.be.ok
    expect(result).to.be.eq(dummyValue)

    expect(error).not.to.be.ok

  })

  it('should properly execute lambda function and return error', async () => {

    const errMessage = 'An error has happened'

    const dummyError = new AlunaError({
      code: AlunaGenericErrorCodes.NOT_FOUND,
      message: errMessage,
      httpStatusCode: 400,
    })
    const dummyFunction = async () => Promise.reject(dummyError)

    const {
      error,
      result,
    } = await executeAndCatch(async () => dummyFunction())

    expect(error).to.be.ok
    expect(error).to.deep.eq(dummyError)

    expect(result).not.to.be.ok

  })

})
