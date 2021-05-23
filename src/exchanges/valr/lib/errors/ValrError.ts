import {
  AAlunaError,
} from '../../../../lib/abstracts/AAlunaError'
import {
  IAlunaError,
} from '../../../../lib/abstracts/IAlunaError'



export class ValrError extends AAlunaError implements IAlunaError {

  constructor (message: string, statusCode = 400) {

    super(message, statusCode)

  }

}
