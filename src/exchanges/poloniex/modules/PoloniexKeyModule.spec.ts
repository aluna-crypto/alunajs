import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockExchangeModule } from '../../../../test/helpers/exchange'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { executeAndCatch } from '../../../utils/executeAndCatch'
import { PoloniexHttp } from '../PoloniexHttp'
import { IPoloniexKeySchema } from '../schemas/IPoloniexKeySchema'
import { PoloniexKeyModule } from './PoloniexKeyModule'



describe('PoloniexKeyModule', () => {

  const poloniexKeyModule = PoloniexKeyModule.prototype

  it('should get permissions from Poloniex API key just fine', async () => {

    mockExchangeModule({ module: poloniexKeyModule })

    const requestMock = ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      Promise.resolve({}),
    )

    const { permissions } = await poloniexKeyModule.fetchDetails()

    expect(permissions.read).to.be.ok
    expect(permissions.trade).to.be.undefined
    expect(permissions.withdraw).to.be.undefined

    expect(requestMock.callCount).to.be.eq(1)

  })

  it('should properly inform when api key or secret are wrong', async () => {

    mockExchangeModule({ module: poloniexKeyModule })

    const alunaErrorMock = new AlunaError({
      message: 'any-message',
      httpStatusCode: 403,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

    ImportMock.mockFunction(
      PoloniexHttp,
      'privateRequest',
      Promise.reject(alunaErrorMock),
    )

    const {
      error,
      result,
    } = await executeAndCatch(() => poloniexKeyModule.fetchDetails())

    expect(result).not.to.be.ok

    expect(error).to.be.ok
    expect(error!.message).to.be.eq('Invalid API key/secret pair.')
    expect(error!.httpStatusCode).to.be.eq(403)
    expect(error!.code).to.be.eq(AlunaKeyErrorCodes.INVALID)

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
