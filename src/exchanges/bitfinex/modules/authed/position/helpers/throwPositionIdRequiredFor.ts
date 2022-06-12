import { AlunaError } from '../../../../../../lib/core/AlunaError'
import { AlunaPositionErrorCodes } from '../../../../../../lib/errors/AlunaPositionErrorCodes'



export const throwPositionIdRequiredFor = (action: string) => {
  throw new AlunaError({
    code: AlunaPositionErrorCodes.DOESNT_HAVE_ID,
    message: `Position id is required to ${action}`,
    httpStatusCode: 200,
  })
}
