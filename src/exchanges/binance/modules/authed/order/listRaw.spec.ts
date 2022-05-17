import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'
import * as listRawMod from '../../public/symbol/listRaw'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Binance raw orders just fine', async () => {

    // preparing data
    const spotOrders = cloneDeep([BINANCE_RAW_ORDERS[0]])
    const marginOrders = cloneDeep([BINANCE_RAW_ORDERS[1]])

    const rawSymbols = BINANCE_RAW_SYMBOLS
    const binanceOrders = spotOrders.concat(marginOrders)


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })
    authedRequest.onFirstCall().returns(Promise.resolve(spotOrders))
    authedRequest.onSecondCall().returns(Promise.resolve(marginOrders))

    const { listRaw } = mockListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({ rawSymbols }))


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq({
      binanceOrders,
      rawSymbols,
    })

    expect(authedRequest.callCount).to.be.eq(2)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getBinanceEndpoints(exchange.settings).order.spot,
      weight: 40,
    })

    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: getBinanceEndpoints(exchange.settings).order.margin,
      weight: 10,
    })

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.deep.eq({
      http: new BinanceHttp({}),
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
