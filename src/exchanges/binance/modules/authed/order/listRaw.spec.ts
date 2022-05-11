import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Binance raw orders just fine', async () => {

    // preparing data
    const mockedRawOrders = BINANCE_RAW_ORDERS

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrders))

    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq(mockedRawOrders)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getBinanceEndpoints(exchange.settings).order.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
