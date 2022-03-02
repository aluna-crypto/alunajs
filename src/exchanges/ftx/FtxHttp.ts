import axios, { AxiosError } from 'axios'
import crypto from 'crypto'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { FtxLog } from './FtxLog'



interface ISignedHashParams {
  keySecret: IAlunaKeySecretSchema
  verb: AlunaHttpVerbEnum
  body?: any
  path: string
}

interface IFtxSignedHeaders {
  'FTX-KEY': string
  'FTX-TS': number
  'FTX-SIGN': string
}

export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  let error: AlunaError

  const message = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const {
      response,
    } = param as AxiosError

    error = new AlunaError({
      message: response?.data?.error || message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      httpStatusCode: response?.status,
      metadata: response?.data,
    })

  } else {

    error = new AlunaError({
      message: param.message || message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

  }

  FtxLog.error(error)

  return error

}

export const generateAuthSignature = (
  params: ISignedHashParams,
): IFtxSignedHeaders => {

  const {
    keySecret,
    body,
    verb,
    path,
  } = params

  const timestamp = new Date().getTime()

  const signedHeader = crypto
    .createHmac('sha256', keySecret.secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(path)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')


  return {
    'FTX-KEY': keySecret.key,
    'FTX-SIGN': signedHeader,
    'FTX-TS': timestamp,
  }

}

export const FtxHttp: IAlunaHttp = class {

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
    } = params

    const signedHash = generateAuthSignature({
      keySecret,
      body,
      verb,
      path: new URL(url).pathname,
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
