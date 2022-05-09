import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { BITFINEX_RAW_POSITIONS } from '../../../test/fixtures/bitfinexPosition'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list raw positions just fine', async () => {

    // preparing data
    const mockedRawPositions = BITFINEX_RAW_POSITIONS


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawPositions))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { rawPositions } = await exchange.position!.listRaw()


    // validating
    expect(rawPositions).to.deep.eq(mockedRawPositions)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitfinexEndpoints(exchange.settings).position.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
