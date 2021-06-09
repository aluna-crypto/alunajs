import { AlunaError } from '../../core/AlunaError'



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

    throw new AlunaError({
      message: `${errorMessagePrefix} not supported: ${from}`,
    })

  }
