import axios from 'axios'
import crypto from 'crypto'

import { AAlunaPrivateRequest } from '@lib/abstracts/AAlunaPrivateRequest'
import { IAlunaRequestOptions } from '@lib/abstracts/IAlunaPublicRequest'
import {
  IAlunaRequest,
  IAlunaRequestParams,
} from '@lib/abstracts/IAlunaRequest'
import { HttpVerbEnum } from '@lib/enums/HtttpVerbEnum'

import { ValrError } from '../errors/ValrError'



export interface IValrPrivateRequestParams extends IAlunaRequestParams {
  path: string
}

interface ISignedHashParams {
  verb: HttpVerbEnum
  path: string
  body?: any
}

export class ValrPrivateRequest
  extends AAlunaPrivateRequest
  implements IAlunaRequest {

  async get<T> (params: IValrPrivateRequestParams): Promise<T> {

    const {
      url, path, options = {} as IAlunaRequestOptions,
    } = params

    const authHeader = this.generateAuthHeader({
      verb: HttpVerbEnum.GET,
      path,
    })

    Object.assign(options.headers, {
      ...authHeader,
    })

    try {

      const res = await axios.get<T>(url, options)

      return res.data

    } catch (error) {

      throw this.formatRequestError(error)

    }

  }

  async post<T> (params: IValrPrivateRequestParams): Promise<T> {

    const {
      url,
      path,
      body,
      options = {} as IAlunaRequestOptions,
    } = params

    const authHeader = this.generateAuthHeader({
      verb: HttpVerbEnum.POST,
      path,
      body,
    })

    Object.assign(options.headers, {
      ...authHeader,
    })

    try {

      const res = await axios.post<T>(url, body, options)

      return res.data

    } catch (error) {

      throw this.formatRequestError(error)

    }

  }

  private generateAuthHeader = (params: ISignedHashParams) => {

    const timestamp = Date.now()

    const {
      verb,
      path,
      body = '',
    } = params

    const {
      keySecret: {
        key,
        secret,
      },
    } = this.exchange

    const signedRequest = crypto
      .createHmac('sha512', secret)
      .update(timestamp.toString())
      .update(verb.toUpperCase())
      .update(`${path}`)
      .update(body)
      .digest('hex')

    return {
      'X-VALR-API-KEY': key,
      'X-VALR-SIGNATURE': signedRequest,
      'X-VALR-TIMESTAMP': timestamp,
    }

  }

  private formatRequestError (error: any): ValrError {

    const {
      response,
    } = error

    if (response && response.data && response.data.message) {

      return new ValrError(response.data.message, response.status)

    }

    return new ValrError(error.message)

  }

}
