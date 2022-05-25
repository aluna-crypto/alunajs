import { expect } from 'chai'
import { filter, find } from 'lodash'
import { ImportMock } from 'ts-mock-imports'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../../../lib/errors/AlunaAccountsErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'

import { HuobiAccountTypeEnum } from '../../../enums/HuobiAccountTypeEnum'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { HUOBI_RAW_ACCOUNTS } from '../../../test/fixtures/huobiHelpers'
import * as getHuobiAccountIdMod from './getHuobiAccountId'



describe(__filename, () => {

  const {
    getHuobiAccountId,
  } = getHuobiAccountIdMod

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Huobi raw order status just fine', async () => {

    // preparing data
    const mockedRawAccounts = HUOBI_RAW_ACCOUNTS

    const spotAccount = find(
      mockedRawAccounts,
      {
        type: HuobiAccountTypeEnum.SPOT,
      },
    )

    const { id: accountId } = spotAccount!

    // mocking

    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    const http = new HuobiHttp({ })

    const {
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    authedRequest
      .onFirstCall()
      .returns(Promise.resolve(mockedRawAccounts))

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { accountId: accId } = await getHuobiAccountId({
      settings: exchange.settings,
      credentials,
      http,
    })

    // validating
    expect(accId).to.deep.eq(accountId)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getHuobiEndpoints(exchange.settings).helpers.listAccounts,
    })

  })

  it('should throw an error for Huobi raw order status not found', async () => {

    // preparing data
    const mockedRawAccounts = filter(
      HUOBI_RAW_ACCOUNTS,
      (account) => account.type !== HuobiAccountTypeEnum.SPOT,
    )

    // mocking

    const http = new HuobiHttp({ })

    const {
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve(mockedRawAccounts))

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { error, result } = await executeAndCatch(
      () => getHuobiAccountId({
        settings: exchange.settings,
        credentials,
        http,
      }),
    )


    // validating

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaAccountsErrorCodes.TYPE_NOT_FOUND)
    expect(error?.message).to.be.eq('spot account not found')
    expect(error?.httpStatusCode).to.be.eq(404)

  })

})
