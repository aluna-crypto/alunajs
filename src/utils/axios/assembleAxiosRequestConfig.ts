import { AxiosRequestConfig } from 'axios'
import { assign } from 'lodash'

import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaProxySchema } from '../../lib/schemas/IAlunaSettingsSchema'



export interface IAssembleAxiosRequestConfigParams {
  url: string
  method: AlunaHttpVerbEnum
  data?: any
  headers?: any
  proxySettings?: IAlunaProxySchema
}

export interface IAssembleAxiosRequestConfigReturns {
  requestConfig: AxiosRequestConfig
}



export const assembleAxiosRequestConfig = (
  params: IAssembleAxiosRequestConfigParams,
): IAssembleAxiosRequestConfigReturns => {

  const { proxySettings, ...requestConfig } = params

  if (proxySettings) {

    const {
      host,
      port,
      agent,
      protocol = 'http:',
    } = proxySettings

    assign(requestConfig, {
      host,
      port,
      protocol,
    })

    if (protocol === 'http:') {

      assign<AxiosRequestConfig, AxiosRequestConfig>(requestConfig, {
        httpAgent: agent,
      })

    } else {

      assign<AxiosRequestConfig, AxiosRequestConfig>(requestConfig, {
        httpsAgent: agent,
      })

    }

  }

  const output: IAssembleAxiosRequestConfigReturns = {
    requestConfig,
  }

  return output

}
