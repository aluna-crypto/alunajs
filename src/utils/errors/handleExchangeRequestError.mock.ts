import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import * as mod from './handleExchangeRequestError'



export const mockTestRegexPatterns = (
  response = true,
) => {

  const testRegexPatternsMock = ImportMock.mockFunction(
    mod,
    'testRegexPatterns',
    response,
  )


  return { testRegexPatternsMock }

}



export const mockHandleExchangeRequestError = (
  params?: Partial<AlunaError>,
) => {

  const code = AlunaHttpErrorCodes.REQUEST_ERROR
  const message = 'Unknown Error'
  const httpStatusCode = 400
  const metadata = {}

  const alunaError = new AlunaError({
    code,
    message,
    httpStatusCode,
    metadata,
    ...params,
  })

  const handleExchangeRequestErrorMock = ImportMock.mockFunction(
    mod,
    'handleExchangeRequestError',
    { alunaError },
  )

  return { handleExchangeRequestErrorMock }

}
