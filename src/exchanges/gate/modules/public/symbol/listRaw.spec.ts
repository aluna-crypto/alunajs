import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Gate } from '../../../Gate'
import { GateHttp } from '../../../GateHttp'
import { getGateEndpoints } from '../../../gateSpecs'
import { GATE_RAW_SYMBOLS } from '../../../test/fixtures/gateSymbols'



describe(__filename, () => {

  it('should list Gate raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    publicRequest.returns(Promise.resolve(GATE_RAW_SYMBOLS))


    // executing
    const exchange = new Gate({})

    const {
      rawSymbols,
      requestCount,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq(GATE_RAW_SYMBOLS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getGateEndpoints(exchange.settings).symbol.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
