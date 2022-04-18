import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { HuobiHttp } from '../HuobiHttp'
import { HuobiLog } from '../HuobiLog'
import { IHuobiKeySchema } from '../schemas/IHuobiKeySchema'
import { HUOBI_RAW_ACCOUNTS } from '../test/fixtures/huobiBalance'
import { HuobiKeyModule } from './HuobiKeyModule'



describe('HuobiKeyModule', () => {

  const huobiKeyModule = HuobiKeyModule.prototype

  it('should get permissions from Huobi API key just fine', async () => {

    ImportMock.mockOther(
      huobiKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IHuobiKeySchema = {
      permission: '',
      ...mockRest,
    }

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
      { data: [requestResponse], requestCount: 1 },
    )

    requestMock.onFirstCall().returns({
      data: 1234,
      requestCount: 1,
    })

    requestMock.onSecondCall().returns({
      data: [requestResponse],
      requestCount: 1,
    })

    requestMock.onThirdCall().returns({
      data: HUOBI_RAW_ACCOUNTS,
      requestCount: 1,
    })

    const {
      key: {
        permissions: permissions1,
      }, requestCount,
    } = await huobiKeyModule.fetchDetails()

    expect(permissions1.read).not.to.be.ok
    expect(permissions1.trade).not.to.be.ok
    expect(permissions1.withdraw).not.to.be.ok

    expect(requestCount).to.be.eq(3)

    expect(requestMock.callCount).to.be.eq(3)

    requestResponse.permission = 'readOnly,trade'

    requestMock.onCall(3).returns({
      data: 1234,
      requestCount: 1,
    })

    requestMock.onCall(4).returns({
      data: [requestResponse],
      requestCount: 1,
    })

    requestMock.onCall(5).returns({
      data: HUOBI_RAW_ACCOUNTS,
      requestCount: 1,
    })

    const {
      key: { permissions: permissions2 },
    } = await huobiKeyModule.fetchDetails()


    expect(permissions2.read).to.be.ok
    expect(permissions2.trade).to.be.ok
    expect(permissions2.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(6)

  })



  it('should properly inform when api key or secret are wrong', async () => {

    ImportMock.mockOther(
      huobiKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
      Promise.reject(new AlunaError({
        message: 'any-message',
        httpStatusCode: 401,
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
      })),
    )

    let result
    let error

    try {

      result = await huobiKeyModule.fetchDetails()

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)


  })

  it('should properly throw an error when a spot account is not found',
    async () => {

      ImportMock.mockOther(
        huobiKeyModule,
        'exchange',
        {
          keySecret: {
            key: '',
            secret: '',
          },
        } as IAlunaExchange,
      )

      const requestMock = ImportMock.mockFunction(
        HuobiHttp,
        'privateRequest',
      )

      requestMock.onFirstCall().returns({
        data: 1234,
        requestCount: 1,
      })

      requestMock.onSecondCall().returns({
        data: [],
        requestCount: 1,
      })

      requestMock.onThirdCall().returns({
        data: [],
        requestCount: 1,
      })

      let result
      let error

      try {

        result = await huobiKeyModule.fetchDetails()

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error).to.be.ok
      expect(error.message).to.be.eq('spot account not found')
      expect(error.httpStatusCode).to.be.eq(404)
      expect(error.code).to.be.eq(AlunaAccountsErrorCodes.TYPE_NOT_FOUND)


    })



  it('should parse Huobi permissions just fine', async () => {

    const mockRest: any = {} // mock requestResponse

    const key: IHuobiKeySchema = {
      permission: 'readOnly,trade,withdraw',
      canTrade: true,
      ...mockRest,
    }

    const { key: perm1 } = huobiKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).to.be.ok
    expect(perm1.withdraw).to.be.ok

  })



  it('should fall on default case for parse', async () => {

    const mockRest: any = {} // mock requestResponse

    const logInfoMock = ImportMock.mockFunction(HuobiLog, 'info', {
      concat: () => '',
    })

    const key: IHuobiKeySchema = {
      permission: 'non-existent',
      ...mockRest,
    }

    const { key: perm1 } = huobiKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(logInfoMock.callCount).to.be.eq(1)
    expect(perm1.read).not.to.be.ok
    expect(perm1.trade).not.to.be.ok
    expect(perm1.withdraw).not.not.to.be.ok

  })

})
