import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { FtxHttp } from '../FtxHttp'
import { IFtxKeySchema } from '../schemas/IFtxKeySchema'
import { FtxKeyModule } from './FtxKeyModule'



describe('FtxKeyModule', () => {

  const ftxKeyModule = FtxKeyModule.prototype

  it('should get permissions from Ftx API key just fine', async () => {

    ImportMock.mockOther(
      ftxKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IFtxKeySchema = {
      readOnly: true,
      account: {
        accountIdentifier: 123,
      },
      ...mockRest,
    }

    const requestMock = ImportMock.mockFunction(
      FtxHttp,
      'privateRequest',
    )

    requestMock.onFirstCall().returns({
      data: { result: requestResponse },
      requestCount: 1,
    })
    requestMock.onSecondCall().returns({
      data: {
        result: {
          ...requestResponse,
          readOnly: false,
        },
      },
      requestCount: 1,
    })
    requestMock.onThirdCall().returns({
      data: {
        result: {
          ...requestResponse,
          readOnly: false,
          withdrawalEnabled: true,
        },
      },
      requestCount: 1,
    })

    const {
      key: {
        permissions: permissions1,
        accountId,
      },
    } = await ftxKeyModule.fetchDetails()

    expect(accountId).to.be.eq(
      requestResponse.account.accountIdentifier.toString(),
    )
    expect(permissions1.read).to.be.ok
    expect(permissions1.trade).not.to.be.ok
    expect(permissions1.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(1)

    const {
      key: {
        permissions: permissions2,
      },
    } = await ftxKeyModule.fetchDetails()


    expect(permissions2.read).to.be.ok
    expect(permissions2.trade).to.be.ok
    expect(permissions2.withdraw).not.to.be.ok

    expect(requestMock.callCount).to.be.eq(2)

    const {
      key: {
        permissions: permissions3,
      },
    } = await ftxKeyModule.fetchDetails()

    expect(permissions3.read).to.be.ok
    expect(permissions3.trade).to.be.ok
    expect(permissions3.withdraw).to.be.ok

    expect(requestMock.callCount).to.be.eq(3)

  })



  it('should properly inform when api key or secret are wrong', async () => {

    ImportMock.mockOther(
      ftxKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    ImportMock.mockFunction(
      FtxHttp,
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

      result = await ftxKeyModule.fetchDetails()

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)


  })



  it('should parse Ftx permissions just fine', async () => {

    const mockRest: any = {} // mock requestResponse

    const key: IFtxKeySchema = {
      readOnly: false,
      ...mockRest,
    }

    const { key: perm1 } = ftxKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).to.be.ok
    expect(perm1.withdraw).not.to.be.ok

  })

})
