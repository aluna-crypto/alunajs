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
  queryString?: string
}



interface IGateIOSignedHeaders {
  KEY: string
  SIGN: string
  Timestamp: string
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
    keySecret,
    path,
    verb,
    body = '',
    queryString = '',
  } = params


  const timestamp: string = (new Date().getTime() / 1000).toString()

  const bodyHash = crypto
    .createHash('sha512')
    .update(body)
    .digest('hex')

  const signatureString = [
    verb.toUpperCase(),
    path,
    queryString,
    bodyHash,
    timestamp,
  ].join('\n')

  const signature = crypto
    .createHmac('sha512', keySecret.secret)
    .update(signatureString)
    .digest('hex')

  return {
    KEY: keySecret.key,
    SIGN: signature,
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

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      keySecret,
      queryString = '',
    } = params

    const signedHash = generateAuthHeader({
      verb,
      path: new URL(url).pathname,
      keySecret,
      body,
      queryString,
    })


    const requestConfig = {
      url,
      method: verb,
      data: body,
      headers: signedHash,
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
