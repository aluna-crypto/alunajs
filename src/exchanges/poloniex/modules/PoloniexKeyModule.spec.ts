import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { PoloniexHttp } from '../PoloniexHttp'
import { IPoloniexKeySchema } from '../schemas/IPoloniexKeySchema'
import { PoloniexKeyModule } from './PoloniexKeyModule'



describe('PoloniexKeyModule', () => {

  const poloniexKeyModule = PoloniexKeyModule.prototype

  it('should get permissions from Poloniex API key just fine', async () => {

    ImportMock.mockOther(
      poloniexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const mockRest: any = {} // mock requestResponse

    const requestResponse: IPoloniexKeySchema = {
      ...mockRest, // without accountId
    }

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      requestResponse,
    )

    requestMock.onFirstCall().returns({})

    const { permissions } = await poloniexKeyModule.fetchDetails()

    expect(permissions.read).to.be.ok
    expect(permissions.trade).to.be.undefined
    expect(permissions.withdraw).to.be.undefined

    expect(requestMock.callCount).to.be.eq(1)

  })



  it('should properly inform when api key or secret are wrong', async () => {

    ImportMock.mockOther(
      poloniexKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const alunaErrorMock = new AlunaError({
      message: 'any-message',
      httpStatusCode: 401,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

    ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      Promise.reject(alunaErrorMock),
    )

    let result
    let error

    try {

      result = await poloniexKeyModule.fetchDetails()

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error.message).to.be.eq('any-message')
    expect(error.httpStatusCode).to.be.eq(401)
    expect(error.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)

  })



  it('should parse Poloniex permissions just fine', async () => {

    const key: IPoloniexKeySchema = {
      read: true,
    }

    const perm1 = poloniexKeyModule.parsePermissions({
      rawKey: key,
    })

    expect(perm1.read).to.be.ok
    expect(perm1.trade).to.be.undefined
    expect(perm1.withdraw).to.be.undefined

  })

})
