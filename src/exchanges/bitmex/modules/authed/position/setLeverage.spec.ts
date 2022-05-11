import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { IAlunaPositionSetLeverageParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { getLeverage } from './getLeverage'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should set leverage just fine', async () => {

    // preparing data
    const mockedLeverage = 10


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedLeverage))
    expect(getLeverage).to.exist


    // executing
    const exchange = new BitmexAuthed({
      credentials,
    })

    const params: IAlunaPositionSetLeverageParams = {
      id: 'id',
      symbolPair: 'symbolPair',
      leverage: 10,
    }

    const { leverage } = await exchange.position!.setLeverage!(params)


    // validating
    expect(leverage).to.deep.eq(mockedLeverage)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitmexEndpoints({}).position.setLeverage,
      body: params,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
