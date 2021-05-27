import axios from 'axios'
import crypto from 'crypto'

import { AAlunaRequest } from '@lib/abstracts/AAlunaRequest'
import {
  IAlunaRequest,
  IAlunaRequestPublicParams,
  IAlunaRequestPrivateParams,
} from '@lib/abstracts/IAlunaRequest'
import { HttpVerbEnum } from '@lib/enums/HtttpVerbEnum'
import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'

import { ValrError } from './ValrError'



export interface IValrPublicRequestParams extends IAlunaRequestPublicParams {
  path?: string
}

export interface IValrPrivateRequestParams extends IAlunaRequestPrivateParams {
  path: string
}


interface ISignedHashParams {
  verb: HttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}



export class ValrRequest extends AAlunaRequest implements IAlunaRequest {



  async get<T> (params: IValrPublicRequestParams): Promise<T> {


    if (params.keySecret && params.path) {

      return this.privateGet<T>({
        ...params,
        keySecret: params.keySecret,
        path: params.path,
      })

    }

    return this.publicGet<T>(params)

  }



  async post<T> (params: IValrPublicRequestParams): Promise<T> {


    if (params.keySecret && params.path) {

      return this.privatePost<T>({
        ...params,
        keySecret: params.keySecret,
        path: params.path,
      })

    }

    return this.publicPost<T>(params)

  }



  async publicGet<T> (params: IValrPublicRequestParams): Promise<T> {

    const {
      url, options,
    } = params

    const requestConfig = {
      headers: options?.headers,
    }

    try {

      const res = await axios.get(url, requestConfig)

      return res.data

    } catch (error) {

      throw this.formatRequestError(error)

    }

  }



  async publicPost<T> (params: IValrPublicRequestParams): Promise<T> {

    const {
      url,
      body,
      options,
    } = params

    const requestConfig = {
      data: body || undefined,
      headers: options?.headers,
    }

    try {

      const res = await axios.post(url, requestConfig)

      return res.data

    } catch (error) {

      throw this.formatRequestError(error)

    }

  }



  async privateGet<T> (params: IValrPrivateRequestParams): Promise<T> {

    const {
      url,
      keySecret,
      path,
      options,
    } = params

    const requestConfig = {
      headers: options?.headers,
    }


    const signedHash = this.generateAuthHeader({
      verb: HttpVerbEnum.GET,
      path,
      keySecret,
    })

    Object.assign(requestConfig, {
      headers: requestConfig.headers
        ? {
          ...requestConfig.headers,
          ...signedHash,
        }
        : signedHash,
    })


    try {

      const res = await axios.get(url, requestConfig)

      return res.data

    } catch (error) {

      throw this.formatRequestError(error)

    }

  }



  async privatePost<T> (params: IValrPrivateRequestParams): Promise<T> {

    const {
      url,
      keySecret,
      body,
      path,
      options,
    } = params

    const requestConfig = {
      data: body || undefined,
      headers: options?.headers,
    }


    const signedHash = this.generateAuthHeader({
      verb: HttpVerbEnum.POST,
      path,
      body,
      keySecret,
    })

    Object.assign(requestConfig, {
      headers: requestConfig.headers
        ? {
          ...requestConfig.headers,
          ...signedHash,
        }
        : signedHash,
    })


    try {

      const res = await axios.post(url, requestConfig)

      return res.data

    } catch (error) {

      throw this.formatRequestError(error)

    }

  }

  private generateAuthHeader = (params: ISignedHashParams) => {

    const {
      keySecret, path, verb, body = '',
    } = params


    const timestamp = Date.now()

    const signedRequest = crypto
      .createHmac('sha512', keySecret.secret)
      .update(timestamp.toString())
      .update(verb.toUpperCase())
      .update(`${path}`)
      .update(body)
      .digest('hex')

    return {
      'X-VALR-API-KEY': keySecret.key,
      'X-VALR-SIGNATURE': signedRequest,
      'X-VALR-TIMESTAMP': timestamp,
    }

  }

  private formatRequestError (error: any): ValrError {

    const {
      response,
    } = error

    if (response && response.data && response.data.message) {

      return new ValrError({
        message: response.data.message,
        statusCode: response.status,
      })

    }

    return new ValrError({
      message: error.message,
      statusCode: error.statusCode || 400,
    })

  }

}
