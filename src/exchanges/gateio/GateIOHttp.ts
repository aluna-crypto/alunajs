import axios, { AxiosError } from 'axios'
import crypto from 'crypto'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { GateIOLog } from './GateIOLog'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}

interface IGateIOSignedHeaders {
  KEY: string
  SIGN: string
  Timestamp: number
}



export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  let error: AlunaError

  const errorMsg = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const { response } = param as AxiosError

    error = new AlunaError({
      message: response?.data?.message || errorMsg,
      statusCode: response?.status,
    })

  } else {

    error = new AlunaError({
      message: param.message || errorMsg,
    })

  }

  GateIOLog.error(error)

  return error

}


export const generateAuthHeader = (
  params: ISignedHashParams,
):IGateIOSignedHeaders => {

  const {
    keySecret, path, verb, body,
  } = params

  const fullPath = `/api/v4${path}`

  const timestamp = Date.now()


  const bodyHash = crypto
    .createHmac('sha512', body ? JSON.stringify(body) : '')
    .digest('hex')


  const signatureString = `${verb}\n${fullPath}\n${bodyHash}\n${timestamp}`

  const signedRequest = crypto
    .createHmac('sha512', keySecret.secret)
    .update(signatureString)
    .digest('hex')


  return {
    KEY: keySecret.key,
    SIGN: signedRequest,
    Timestamp: timestamp,
  }

}



export const GateIOHttp: IAlunaHttp = class {

  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
    } = params

    const requestConfig = {
      url,
      method: verb,
      data: body,
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw handleRequestError(error)

    }

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
