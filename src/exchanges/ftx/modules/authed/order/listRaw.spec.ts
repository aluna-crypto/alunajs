import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import {
  FTX_RAW_ORDERS,
  FTX_TRIGGER_RAW_ORDERS,
} from '../../../test/fixtures/ftxOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Ftx raw orders just fine', async () => {

    // preparing data
    const mockedOrdinaryOrders = FTX_RAW_ORDERS
    const mockedTriggerOrders = FTX_TRIGGER_RAW_ORDERS

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve(mockedOrdinaryOrders))
    authedRequest.onSecondCall().returns(Promise.resolve(mockedTriggerOrders))

    // executing
    const exchange = new FtxAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq([
      ...mockedOrdinaryOrders,
      ...mockedTriggerOrders,
    ])

    expect(authedRequest.callCount).to.be.eq(2)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getFtxEndpoints(exchange.settings).order.list,
    })

    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getFtxEndpoints(exchange.settings).order.listTriggerOrders,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
