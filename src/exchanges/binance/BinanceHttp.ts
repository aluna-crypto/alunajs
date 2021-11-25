import axios, { AxiosError } from 'axios'
import crypto from 'crypto'

import { IAlunaKeySecretSchema } from '../..'
import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { BinanceLog } from './BinanceLog'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  keySecret: IAlunaKeySecretSchema
  body?: any
}


interface IBinanceSecureHeaders {
  "X-MBX-APIKEY": string
}

interface IBinanceSignedSignature {
  signature: string
}

export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  let error: AlunaError

  const errorMsg = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const {
      response,
    } = param as AxiosError

    error = new AlunaError({
      message: response?.data?.msg || errorMsg,
      statusCode: response?.status,
    })

  } else {

    error = new AlunaError({
      message: param.message || errorMsg,
    })

  }

  BinanceLog.error(error)

  return error

}

export const generateAuthSignature = (
  params: ISignedHashParams,
): IBinanceSignedSignature => {

  const {
    keySecret, verb, body,
  } = params


  const timestamp = Date.now()

  const signedRequest = crypto
    .createHmac('sha256', keySecret.secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  return {
    signature: signedRequest
  };

}


export const BinanceHttp: IAlunaHttp = class {

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
      verb,
      keySecret,
      body,
    })

    const headers: IBinanceSecureHeaders = {
      "X-MBX-APIKEY": keySecret.key
    }

    const requestConfig = {
      url,
      method: verb,
      data: {
        ...body,
        ...signedHash
      },
      headers,
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
