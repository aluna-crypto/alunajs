import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { GateAuthed } from '../../../GateAuthed'
import { GateHttp } from '../../../GateHttp'
import { gateEndpoints } from '../../../gateSpecs'
import { GATE_RAW_BALANCES } from '../../../test/fixtures/gateBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Gate raw balances just fine', async () => {

    // preparing data
    const mockedBalances = GATE_RAW_BALANCES


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedBalances))


    // executing
    const exchange = new GateAuthed({ credentials })

    const { rawBalances } = await exchange.balance.listRaw()


    // validating
    expect(rawBalances).to.deep.eq(mockedBalances)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: gateEndpoints.balance.list,
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
