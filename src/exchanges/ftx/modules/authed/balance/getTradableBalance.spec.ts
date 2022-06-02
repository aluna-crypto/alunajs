import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get Ftx tradable balance just fine', async () => {

    // preparing data
    const mockedBalance = 50


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve({ freeCollateral: mockedBalance }))


    // executing
    const exchange = new FtxAuthed({
      credentials,
    })

    const { settings } = exchange

    const { tradableBalance } = await exchange.balance.getTradableBalance!({
      symbolPair: '',
    })


    // validating
    expect(tradableBalance).to.deep.eq(mockedBalance)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getFtxEndpoints(settings).balance.account,
      verb: AlunaHttpVerbEnum.GET,
    })

    expect(publicRequest.callCount).to.be.eq(0)
  })

})
