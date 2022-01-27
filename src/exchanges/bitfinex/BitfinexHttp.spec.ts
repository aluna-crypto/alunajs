import axios from 'axios'
import { expect } from 'chai'
import crypto from 'crypto'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import {
  AlunaHttpVerbEnum,
  IAlunaKeySecretSchema,
} from '../..'
import * as BitfinexHttpMod from './BitfinexHttp'



describe('BitfinexHttp', () => {

  const { BitfinexHttp } = BitfinexHttpMod

  const { publicRequest, privateRequest } = BitfinexHttp

  const dummyUrl = 'http://dummy.com/path/XXXDUMMY/dummy'
  const dummyBody = { dummy: 'dummy-body' }
  const dummyData = { data: 'dummy-data' }
  const dummySignedHeaders = { 'X-DUMMY': 'dummy' }
  const dummyKeysecret: IAlunaKeySecretSchema = {
    key: 'key',
    secret: 'secret',
  }

  afterEach(Sinon.restore)

  it('should defaults the http verb to get on public requests', async () => {

    const requestSpy = Sinon.spy(async () => dummyData)

    const axiosCreate = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    await publicRequest({
      // http verb not informed
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosCreate.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)

    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])


  })

  it('should execute public request just fine', async () => {

    const requestSpy = Sinon.spy(() => dummyData)

    const axiosMock = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    const responseData = await publicRequest({
      verb: AlunaHttpVerbEnum.GET,
      url: dummyUrl,
      body: dummyBody,
    })

    expect(axiosMock.callCount).to.be.eq(1)

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.GET,
      data: dummyBody,
    }])

    expect(responseData).to.deep.eq(requestSpy.returnValues[0].data)

  })

  it('should throw error for public', async () => {

    const requestSpy = Sinon.spy(() => Promise.reject())

    ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    let error

    try {

      await publicRequest({
        verb: AlunaHttpVerbEnum.GET,
        url: dummyUrl,
        body: dummyBody,
      })


    } catch (e) {

      error = e

    }

    expect(error).to.be.ok

  })


  it('should execute private request just fine', async () => {

    const requestSpy = Sinon.spy(() => dummyData)

    const generateAuthHeaderMock = ImportMock.mockFunction(
      BitfinexHttpMod,
      'generateAuthHeader',
      dummySignedHeaders,
    )

    const axiosMock = ImportMock.mockFunction(
      axios,
      'create',
      {
        request: requestSpy,
      },
    )

    const responseData = await privateRequest({
      url: dummyUrl,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })

    expect(axiosMock.callCount).to.be.eq(1)

    expect(generateAuthHeaderMock.callCount).to.be.eq(1)
    expect(generateAuthHeaderMock.calledWith({
      path: new URL(dummyUrl).pathname,
      body: dummyBody,
      keySecret: dummyKeysecret,
    })).to.be.ok

    expect(requestSpy.callCount).to.be.eq(1)
    expect(requestSpy.args[0]).to.deep.eq([{
      url: dummyUrl,
      method: AlunaHttpVerbEnum.POST,
      data: dummyBody,
      headers: dummySignedHeaders,
    }])

    expect(responseData).to.deep.eq(requestSpy.returnValues[0].data)

  })

  it('should generate signed auth header just fine', async () => {

    const createHmacSpy = Sinon.spy(crypto, 'createHmac')
    const updateSpy = Sinon.spy(crypto.Hmac.prototype, 'update')
    const digestSpy = Sinon.spy(crypto.Hmac.prototype, 'digest')

    const currentDate = Date.now()

    const mockedDateNow = ImportMock.mockFunction(
      Date,
      'now',
      currentDate,
    )

    const stringfiedBody = JSON.stringify(dummyBody)

    const path = '/v2/auth/r/permissions'
    const mockedNonce = currentDate * 1000


    const calledSignature = `/api${path}${mockedNonce}${stringfiedBody}`

    const signedHash = BitfinexHttpMod.generateAuthHeader({
      keySecret: dummyKeysecret,
      path,
      body: dummyBody,
    })

    expect(mockedDateNow.callCount).to.be.eq(1)

    expect(createHmacSpy.callCount).to.be.eq(1)
    expect(createHmacSpy.calledWith('sha384', dummyKeysecret.secret)).to.be.ok

    expect(updateSpy.callCount).to.be.eq(1)
    expect(updateSpy.calledWith(calledSignature)).to.be.ok

    expect(digestSpy.callCount).to.be.eq(1)
    expect(digestSpy.calledWith('hex')).to.be.ok

    expect(signedHash['bfx-nonce']).to.deep.eq(mockedNonce.toString())
    expect(signedHash['bfx-apikey']).to.deep.eq(dummyKeysecret.key)
    expect(signedHash['bfx-signature']).to.deep.eq(digestSpy.returnValues[0])

  })

})
