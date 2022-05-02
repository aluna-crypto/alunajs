import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { BITTREX_RAW_BALANCES } from '../../../test/fixtures/bittrexBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Bittrex raw balances just fine', async () => {

    // preparing data
    const http = new BittrexHttp()

    const mockedBalances = BITTREX_RAW_BALANCES


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedBalances))


    // executing
    const exchange = new BittrexAuthed({ credentials })

    const {
      rawBalances,
      requestCount,
    } = await exchange.balance.listRaw({})


    // validating
    expect(rawBalances).to.deep.eq(mockedBalances)

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: `${BITTREX_PRODUCTION_URL}/balances`,
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
