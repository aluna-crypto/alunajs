import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { POLONIEX_RAW_BALANCES } from '../../../test/fixtures/poloniexBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Poloniex raw balances just fine', async () => {

    // preparing data
    const mockedBalances = POLONIEX_RAW_BALANCES


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedBalances))


    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { rawBalances } = await exchange.balance.listRaw()


    // validating
    expect(rawBalances).to.deep.eq(mockedBalances)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getPoloniexEndpoints(exchange.settings).balance.list,
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
