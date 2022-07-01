import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { HUOBI_RAW_BALANCES } from '../../../test/fixtures/huobiBalances'
import * as getHuobiAccountIdMod from '../helpers/getHuobiAccountId'
import { mockGetHuobiAccountId } from '../../../test/mocks/mockGetHuobiAccountId'
import { HUOBI_RAW_ACCOUNTS } from '../../../test/fixtures/huobiHelpers'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Huobi raw balances just fine', async () => {

    // preparing data
    const mockedBalances = HUOBI_RAW_BALANCES

    const { id: accountId } = HUOBI_RAW_ACCOUNTS[0]
    const http = new HuobiHttp({})

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    const { wrapper: getHuobiAccountId } = mockGetHuobiAccountId({
      module: getHuobiAccountIdMod,
    })

    getHuobiAccountId.onFirstCall().returns(Promise.resolve({ accountId }))

    authedRequest.returns(Promise.resolve({ list: mockedBalances }))

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { rawBalances } = await exchange.balance.listRaw()


    // validating
    expect(rawBalances).to.deep.eq(mockedBalances)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getHuobiEndpoints(exchange.settings).balance.list(accountId),
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(getHuobiAccountId.callCount).to.be.eq(1)

    expect(getHuobiAccountId.firstCall.args[0]).to.deep.eq({
      settings: exchange.settings,
      credentials,
      http,
    })

  })

})
