import { ValrLog } from '../../../exchanges/valr/ValrLog'
import { AlunaError } from '../../core/AlunaError'
import { AlunaAdaptersErrorCodes } from '../../errors/AlunaAdaptersErrorCodes'



export type TranslateToMappings<TEnumTo> = {
  [key: string]: TEnumTo,
}

export const buildAdapter = <TEnumFrom, TEnumTo>(params: {
  mappings: TranslateToMappings<TEnumTo>,
  errorMessagePrefix: string,
}) => (params2: { from: TEnumFrom }): TEnumTo => {

    const {
      mappings,
      errorMessagePrefix,
    } = params

    const { from } = params2

    const translated: TEnumTo = mappings[from as unknown as string]

    if (translated) {

      return translated

    }

    const error = new AlunaError({
      errorMsg: `${errorMessagePrefix} not supported: ${from}`,
      errorCode: AlunaAdaptersErrorCodes.ADAPTER_NOT_SUPPORTED,
    })

    ValrLog.error(error)

    throw error

  }
