import { AxiosError } from 'axios'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}



export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  // TODO implement me

  const errorMsg = 'Error while trying to execute Axios request'

  throw new Error('not implemented')

}



export const GateioHttp: IAlunaHttp = class {

  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

    // TODO implement me

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
    } = params

    throw new Error('not implemented')

    // TODO implement me

    // try {

    //   const response = await axios.create().request<T>(requestConfig)

    //   return response.data

    // } catch (error) {

    //   throw handleRequestError(error)

    // }

  }



  static async privateRequest<T> (params: IAlunaHttpPrivateParams): Promise<T> {

    // TODO implement me

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      keySecret,
    } = params

    const requestConfig = {
      url,
      method: verb,
      data: body,
    }

    throw new Error('not implemented')

    // TODO implement me

    // try {

    //   const response = await axios.create().request<T>(requestConfig)

    //   return response.data

    // } catch (error) {

    //   throw handleRequestError(error)

    // }

  }

}
