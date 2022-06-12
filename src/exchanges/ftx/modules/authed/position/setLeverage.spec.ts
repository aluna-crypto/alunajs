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

  it('should set Ftx position leverage just fine', async () => {

    // preparing data
    const leverage = 5

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })
    authedRequest.returns(Promise.resolve())


    // executing
    const exchange = new FtxAuthed({ credentials })
    const { leverage: resLeverage } = await exchange.position!.setLeverage!({
      leverage,
      symbolPair: '',
    })


    // validating
    expect(resLeverage).to.deep.eq(leverage)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getFtxEndpoints(exchange.settings).position.setLeverage,
      body: { leverage },
      verb: AlunaHttpVerbEnum.POST,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
