import { AlunaError } from '../../../../.history/src/lib/abstracts/AAlunaError_20210609201331'



export type TranslateToMappings<TEnumTo> = {
  [key: string]: TEnumTo,
}



export const translateTo = <TEnumFrom, TEnumTo>(params: {
  mappings: TranslateToMappings<TEnumTo>,
  prefix: string,
}) => (params2: { from: TEnumFrom }): TEnumTo => {

    const {
      mappings,
      prefix,
    } = params

    const { from } = params2

    const translated: TEnumTo = mappings[from as unknown as string]

    if (translated) {

      return translated

    }

    throw new AlunaError({
      message: `${prefix} not supported: ${from}`,
    })

  }
