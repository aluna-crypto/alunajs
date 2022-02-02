import axios, { AxiosError } from 'axios'
import crypto from 'crypto'

import {
  AlunaError,
  AlunaHttpErrorCodes,
} from '../..'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'



interface IBitfinexSignedHashParams {
  body?: Record<string, any>
  path: string
  keySecret: IAlunaKeySecretSchema
}



interface IBitfinexSignedHeaders {
  'Content-Type': string
  'bfx-nonce': string
  'bfx-apikey': string
  'bfx-signature': string
}



export const generateAuthHeader = (
  params: IBitfinexSignedHashParams,
): IBitfinexSignedHeaders => {

  const {
    path,
    keySecret,
    body,
  } = params

  const {
    key,
    secret,
  } = keySecret

  const nonce = (Date.now() * 1000).toString()

  const signature = `/api${path}${nonce}${JSON.stringify(body)}`

  const sig = crypto.createHmac('sha384', secret)
    .update(signature)
    .digest('hex')

  return {
    'Content-Type': 'application/json',
    'bfx-nonce': nonce,
    'bfx-apikey': key,
    'bfx-signature': sig,
  }

}



export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  let error: AlunaError

  const message = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const {
      response,
    } = param as AxiosError

    error = new AlunaError({
      message: response?.data?.[2] || message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      httpStatusCode: response?.status,
    })

  } else {

    error = new AlunaError({
      message: param.message || message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

  }

  return error

}



export const BitfinexHttp: IAlunaHttp = class {

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
      body = {},
      verb = AlunaHttpVerbEnum.POST,
      keySecret,
    } = params

    const signedHash = generateAuthHeader({
      path: new URL(url).pathname,
      keySecret,
      body,
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
