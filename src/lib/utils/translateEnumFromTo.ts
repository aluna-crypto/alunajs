
interface IEnumGeneric {
  [key: string]: string
}


/*
  Method will find <string> in source enum <from>, use its relative
  key to find the value on the destination enum <to> and return it.
*/

export interface ITranslateEnumFromToParams {
  string: string // string to translate
  from: IEnumGeneric // source enum
  to: IEnumGeneric // destination enum
}

export const translateEnumFromTo = (
  params: ITranslateEnumFromToParams,
) => {

  const {
    string,
    from,
    to,
  } = params

  // iterates over all keys on source enum
  for(const relativeKey in from) {

    const stringWasFound = (from[relativeKey] === string)

    // if <string> value is matched
    if (stringWasFound) {

      // uses relative key to compute value on destination enum
      const translatedString = to[relativeKey]

      // if none is found, throws error
      if (!translatedString) {
        throw new Error(
          `Enum (to) doesn't have a key named: ${relativeKey}`
        )
      }

      // otherwise, return it
      return translatedString
    }

  }

  // throws error if source enum doesn't have a matching <string>
  throw new Error(
    `Enum (from) doesn't have a key for value: ${string}`
  )

}
