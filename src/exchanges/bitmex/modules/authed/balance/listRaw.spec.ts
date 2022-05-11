import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import {
  BITMEX_ASSETS,
  BITMEX_ASSETS_DETAILS,
} from '../../../test/fixtures/bitmexBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Bitmex raw balances just fine', async () => {

    // preparing data
    const assets = BITMEX_ASSETS
    const assetsDetails = BITMEX_ASSETS_DETAILS


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve(assets))
    authedRequest.onSecondCall().returns(Promise.resolve(assetsDetails))


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { rawBalances } = await exchange.balance.listRaw()


    // validating
    expect(rawBalances).to.deep.eq({
      assets,
      assetsDetails,
    })

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBitmexEndpoints(exchange.settings).balance.assets,
      body: { currency: 'all' },
      credentials,
    })

    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBitmexEndpoints(exchange.settings).balance.assetsDetails,
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
