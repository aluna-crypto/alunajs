import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { HUOBI_RAW_ORDERS } from '../../../test/fixtures/huobiOrders'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import * as listRawMod from '../../public/symbol/listRaw'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Huobi raw orders just fine', async () => {

    // preparing data
    const mockedRawOrders = HUOBI_RAW_ORDERS
    const mockedRawSymbols = HUOBI_RAW_SYMBOLS

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve(mockedRawOrders))
    authedRequest.onSecondCall().returns(Promise.resolve([]))

    const { listRaw: listRawSymbols } = mockListRaw({
      module: listRawMod,
    })

    listRawSymbols.returns(Promise.resolve({
      rawSymbols: mockedRawSymbols,
    }))

    // executing
    const exchange = new HuobiAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()

    // validating
    expect(rawOrders).to.deep.eq({
      rawOrders: mockedRawOrders,
      rawSymbols: mockedRawSymbols,
    })

    expect(authedRequest.callCount).to.be.eq(2)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.list,
    })

    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getHuobiEndpoints(exchange.settings).order.listStop,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
