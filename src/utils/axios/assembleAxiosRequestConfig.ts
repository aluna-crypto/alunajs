import { AxiosRequestConfig } from 'axios'
import { assign } from 'lodash'

import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaProtocolsEnum } from '../../lib/enums/AlunaProxyAgentEnum'
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
    } = proxySettings

    let {
      protocol = AlunaProtocolsEnum.HTTP,
    } = proxySettings

    const isMissingColon = !/:$/.test(protocol)

    if (isMissingColon) {

      protocol = protocol.concat(':') as AlunaProtocolsEnum

    }

    assign(requestConfig, {
      proxy: {
        host,
        port,
        protocol,
      },
    })

    if (protocol === AlunaProtocolsEnum.HTTP) {

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
