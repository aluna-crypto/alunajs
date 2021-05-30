import axios from 'axios'
import crypto from 'crypto'
import { URL } from 'url'

import {
  IAlunaHttp, IAlunaHttpPrivateParams, IAlunaHttpPublicParams,
} from '../../lib/abstracts/IAlunaHttp'
import { HttpVerbEnum } from '../../lib/enums/HtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { ValrError } from './ValrError'



interface ISignedHashParams {
  verb: HttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}



export const formatRequestError = (params: { error: any }): ValrError => {

  const {
    response,
  } = params.error

  if (response && response.data && response.data.message) {

    return new ValrError({
      message: response.data.message,
      statusCode: response.status,
    })

  }

  return new ValrError({
    message: params.error.message,
    statusCode: params.error.response?.status || 400,
  })

}



export const generateAuthHeader = (params: ISignedHashParams) => {

  const {
    keySecret, path, verb, body,
  } = params

  const timestamp = Date.now()

  const signedRequest = crypto
    .createHmac('sha512', keySecret.secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(`${path}`)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  return {
    'X-VALR-API-KEY': keySecret.key,
    'X-VALR-SIGNATURE': signedRequest,
    'X-VALR-TIMESTAMP': timestamp,
  }

}



export const ValrHttp: IAlunaHttp = {

  async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

    const {
      url,
      body,
      verb = HttpVerbEnum.GET,
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

      throw formatRequestError({ error })

    }

  },



  async privateRequest<T> (params: IAlunaHttpPrivateParams): Promise<T> {

    const {
      url,
      body,
      verb = HttpVerbEnum.POST,
      keySecret,
    } = params

    const signedHash = generateAuthHeader({
      verb,
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

      throw formatRequestError({ error })

    }

  },

}
