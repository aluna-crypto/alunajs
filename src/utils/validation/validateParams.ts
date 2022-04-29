import Joi from 'joi'

import { AlunaError } from '../../lib/core/AlunaError'
import { AlunaGenericErrorCodes } from '../../lib/errors/AlunaGenericErrorCodes'



export const validateParams = <T>(
  params: {
    params: T
    schema: Joi.ObjectSchema<T>
  },
): T => {

  const {
    error,
    value: validParams,
  } = params.schema.validate(params.params)

  if (error) {

    throw new AlunaError({
      httpStatusCode: 400,
      message: error.message,
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      metadata: error,
    })

  }

  return validParams || {} as T

}
