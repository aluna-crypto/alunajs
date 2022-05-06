import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { GateAuthed } from '../../../GateAuthed'
import { GateHttp } from '../../../GateHttp'
import { gateEndpoints } from '../../../gateSpecs'
import { GATE_RAW_ORDERS } from '../../../test/fixtures/gateOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Gate raw orders just fine', async () => {

    // preparing data
    const mockedRawOrders = GATE_RAW_ORDERS

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrders))

    // executing
    const exchange = new GateAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq(mockedRawOrders)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: gateEndpoints.order.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
