import { AlunaError } from '../lib/core/AlunaError'



export interface IExecuteAndCatchReturns<T> {
  error?: AlunaError
  result?: T
}



export const executeAndCatch = async <T>(
  lambda: () => any,
): Promise<IExecuteAndCatchReturns<T>> => {

  let error: AlunaError | undefined
  let result: T | undefined

  try {

    result = await lambda()

  } catch (error) {

    return { error }

  }

  return { error, result }

}
