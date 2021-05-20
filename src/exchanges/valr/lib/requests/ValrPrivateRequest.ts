import axios from 'axios'
import crypto from 'crypto'

import { AAlunaPrivateRequest } from '../../../../lib/abstracts/AAlunaPrivateRequest'
import {
  IAlunaPrivateRequest,
  IAlunaPrivateRequestParams,
} from '../../../../lib/abstracts/IAlunaPrivateRequest'
import { IAlunaRequestOptions } from '../../../../lib/abstracts/IAlunaPublicRequest'
import { HttpVerbEnum } from '../../../../lib/enums/HtttpVerbEnum'

export interface IValrPrivateRequestParams extends IAlunaPrivateRequestParams {
  path: string
}

interface ISignedHashParams {
  verb: HttpVerbEnum
  path: string
  body?: any
}

export class ValrPrivateRequest
  extends AAlunaPrivateRequest
  implements IAlunaPrivateRequest
{
  async get<T>(params: IValrPrivateRequestParams): Promise<T> {
    const { url, path, options = {} as IAlunaRequestOptions } = params

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
      throw new Error(error)
    }
  }

  async post<T>(params: IValrPrivateRequestParams): Promise<T> {
    const { url, path, body, options = {} as IAlunaRequestOptions } = params

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
      throw new Error(error)
    }
  }

  private generateAuthHeader = (params: ISignedHashParams) => {
    const timestamp = Date.now()

    const { verb, path, body = '' } = params

    const {
      keySecret: { key, secret },
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
}
