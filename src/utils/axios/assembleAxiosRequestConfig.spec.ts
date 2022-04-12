import { expect } from 'chai'
import { Agent as HttpAgent } from 'http'
import { Agent as HttpsAgent } from 'https'

import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaProtocolsEnum } from '../../lib/enums/AlunaProxyAgentEnum'
import { IAlunaProxySchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { assembleAxiosRequestConfig } from './assembleAxiosRequestConfig'



describe('assembleAxiosRequestConfig', () => {


  const url = 'aluna.com'
  const headers = {
    Key: 'key',
    Sign: 'sign',
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const data = {
    username: 'torres',
  }

  const proxySettings1: IAlunaProxySchema = {
    host: '127.0.0.1',
    port: 3333,
    agent: new HttpAgent(),
  }

  const proxySettings2: IAlunaProxySchema = {
    host: '0.0.0.0',
    port: 9999,
    protocol: AlunaProtocolsEnum.HTTPS,
    agent: new HttpsAgent(),
  }

  it('should properly assemble axios request config', () => {

    const { requestConfig: requestConfig1 } = assembleAxiosRequestConfig({
      method: AlunaHttpVerbEnum.GET,
      url,
    })

    expect(requestConfig1.method).to.be.eq(AlunaHttpVerbEnum.GET)
    expect(requestConfig1.url).to.be.eq(url)

    expect(requestConfig1.data).not.to.be.ok
    expect(requestConfig1.headers).not.to.be.ok


    const { requestConfig: requestConfig2 } = assembleAxiosRequestConfig({
      method: AlunaHttpVerbEnum.DELETE,
      data,
      url,
    })

    expect(requestConfig2.method).to.be.eq(AlunaHttpVerbEnum.DELETE)
    expect(requestConfig2.url).to.be.eq(url)
    expect(requestConfig2.data).to.be.eq(data)

    expect(requestConfig2.headers).not.to.be.ok


    const { requestConfig: requestConfig3 } = assembleAxiosRequestConfig({
      method: AlunaHttpVerbEnum.POST,
      headers,
      url,
    })

    expect(requestConfig3.method).to.be.eq(AlunaHttpVerbEnum.POST)
    expect(requestConfig3.url).to.be.eq(url)
    expect(requestConfig3.headers).to.be.eq(headers)

    expect(requestConfig3.data).not.to.be.ok

  })

  it('should properly setup http proxy settings', () => {

    const { requestConfig } = assembleAxiosRequestConfig({
      method: AlunaHttpVerbEnum.PATCH,
      url,
      proxySettings: proxySettings1,
    })

    expect(requestConfig.method).to.be.eq(AlunaHttpVerbEnum.PATCH)
    expect(requestConfig.url).to.be.eq(url)
    expect(requestConfig).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.PATCH,
      proxy: {
        host: proxySettings1.host,
        port: proxySettings1.port,
        protocol: 'http:',
      },
      httpAgent: proxySettings1.agent,
    })

  })

  it('should properly setup https proxy settings', () => {

    const { requestConfig } = assembleAxiosRequestConfig({
      method: AlunaHttpVerbEnum.PATCH,
      url,
      proxySettings: proxySettings2,
    })

    expect(requestConfig.method).to.be.eq(AlunaHttpVerbEnum.PATCH)
    expect(requestConfig.url).to.be.eq(url)
    expect(requestConfig).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.PATCH,
      proxy: {
        host: proxySettings2.host,
        port: proxySettings2.port,
        protocol: proxySettings2.protocol,
      },
      httpsAgent: proxySettings2.agent,
    })

  })

  it('should add missing colon at the end of the protocol', () => {

    let res = assembleAxiosRequestConfig({
      method: AlunaHttpVerbEnum.GET,
      url,
      proxySettings: {
        ...proxySettings1,
        protocol: 'http' as AlunaProtocolsEnum,
      },
    })

    expect(res.requestConfig.method).to.be.eq(AlunaHttpVerbEnum.GET)
    expect(res.requestConfig.url).to.be.eq(url)
    expect(res.requestConfig).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      proxy: {
        host: proxySettings1.host,
        port: proxySettings1.port,
        protocol: 'http:',
      },
      httpAgent: proxySettings1.agent,
    })

    res = assembleAxiosRequestConfig({
      method: AlunaHttpVerbEnum.GET,
      url,
      proxySettings: {
        ...proxySettings2,
        protocol: 'https' as AlunaProtocolsEnum,
      },
    })

    expect(res.requestConfig.method).to.be.eq(AlunaHttpVerbEnum.GET)
    expect(res.requestConfig.url).to.be.eq(url)
    expect(res.requestConfig).to.deep.eq({
      url,
      method: AlunaHttpVerbEnum.GET,
      proxy: {
        host: proxySettings2.host,
        port: proxySettings2.port,
        protocol: 'https:',
      },
      httpsAgent: proxySettings2.agent,
    })

  })

})
