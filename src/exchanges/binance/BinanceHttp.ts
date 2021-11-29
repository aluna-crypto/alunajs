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
  query?: string
}


interface IBinanceSecureHeaders {
  "X-MBX-APIKEY": string,
}

interface IBinanceSignedSignature {
  signature: string
  dataQueryString: string
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
    keySecret, body,
    query
  } = params

  let dataQueryString = 'recvWindow=20000&timestamp=' + Date.now()

  const signedRequest = crypto
    .createHmac('sha256', keySecret.secret)
    .update(dataQueryString)
    .update(body ? JSON.stringify(body) : '')
    .update(query ? query : '')
    .digest('hex')

  query ? dataQueryString += query : ''

  return {
    signature: signedRequest,
    dataQueryString
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
      query
    } = params

    const signedHash = generateAuthSignature({
      verb,
      keySecret,
      body,
      query
    })

    const fullUrl = url + '?' + signedHash.dataQueryString + '&signature=' + signedHash.signature;

    const headers: IBinanceSecureHeaders = {
      "X-MBX-APIKEY": keySecret.key
    }

    const requestConfig = {
      url: fullUrl,
      method: verb,
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
