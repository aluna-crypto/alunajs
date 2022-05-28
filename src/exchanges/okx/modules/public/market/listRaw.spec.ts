import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { OkxSymbolTypeEnum } from '../../../enums/OkxSymbolTypeEnum'
import { Okx } from '../../../Okx'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_RAW_MARKETS } from '../../../test/fixtures/okxMarket'
import { OKX_RAW_SYMBOLS } from '../../../test/fixtures/okxSymbols'
import * as listRawMod from '../symbol/listRaw'



describe(__filename, () => {

  it('should list Okx raw markets just fine', async () => {

    // preparing data

    const type = OkxSymbolTypeEnum.SPOT

    // mocking
    const http = new OkxHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    publicRequest.returns(Promise.resolve(OKX_RAW_MARKETS))


    const { listRaw: listRawSymbols } = mockListRaw({
      module: listRawMod,
    })

    listRawSymbols.returns(Promise.resolve({
      rawSymbols: OKX_RAW_SYMBOLS,
    }))

    // executing
    const exchange = new Okx({})

    const {
      rawMarkets,
      requestWeight,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq({
      rawMarkets: OKX_RAW_MARKETS,
      rawSymbols: OKX_RAW_SYMBOLS,
    })

    expect(listRawSymbols.callCount).to.be.eq(1)

    expect(listRawSymbols.firstCall.args[0]).to.deep.eq({
      http,
    })

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getOkxEndpoints(exchange.settings).market.list(type),
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
