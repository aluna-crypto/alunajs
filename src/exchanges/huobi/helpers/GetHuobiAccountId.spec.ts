import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { HuobiHttp } from '../HuobiHttp'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import { HuobiAccountTypeEnum } from '../schemas/IHuobiBalanceSchema'
import { HUOBI_RAW_ACCOUNTS } from '../test/fixtures/huobiBalance'
import { getHuobiAccountId } from './GetHuobiAccountId'



describe('GetHuobiAccountId', () => {


  it('should successfully get an huobi account id', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
    )

    requestMock.onFirstCall().returns({
      data: HUOBI_RAW_ACCOUNTS,
      requestCount: 1,
    })

    const {
      accountId,
      requestCount,
    } = await getHuobiAccountId(keySecret)

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.firstCall.calledWith({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_HUOBI_URL}/v1/account/accounts`,
      keySecret,
    })).to.be.ok

    const huobiAccountId = HUOBI_RAW_ACCOUNTS.find(
      (acc) => acc.type === HuobiAccountTypeEnum.SPOT,
    )!.id

    expect(requestCount).to.eq(1)

    expect(huobiAccountId).to.eq(accountId)

  })

  it('should ensure a spot account is available', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    const requestMock = ImportMock.mockFunction(
      HuobiHttp,
      'privateRequest',
    )

    requestMock.onFirstCall().returns({
      data: HUOBI_RAW_ACCOUNTS.filter(
        (acc) => acc.type !== HuobiAccountTypeEnum.SPOT,
      ),
      requestCount: 1,
    })


    let result
    let error

    try {

      result = await getHuobiAccountId(keySecret)

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message).to.be.eq('spot account not found')
    expect(error.code).to.be.eq(AlunaAccountsErrorCodes.TYPE_NOT_FOUND)

  })

})
