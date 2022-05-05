import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { VALR_RAW_BALANCES } from '../../../test/fixtures/valrBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Valr raw balances just fine', async () => {

    // preparing data
    const mockedBalances = VALR_RAW_BALANCES


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedBalances))


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { rawBalances } = await exchange.balance.listRaw()


    // validating
    expect(rawBalances).to.deep.eq(mockedBalances)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: valrEndpoints.balance.list,
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
