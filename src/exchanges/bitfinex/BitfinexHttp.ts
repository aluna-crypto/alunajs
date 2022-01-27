import axios from 'axios'
import crypto from 'crypto'

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

      // TODO: Handle errors here
      throw Error(error)

    }

  }

  static async privateRequest<T> (params: IAlunaHttpPrivateParams): Promise<T> {

    // TODO: Implement private request
    throw Error(`Not implemented ${JSON.stringify(params)}`)

  }

}
