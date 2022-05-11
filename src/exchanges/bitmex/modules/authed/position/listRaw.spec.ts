import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list raw positions just fine', async () => {

    // preparing data
    const mockedRawPositions = BITMEX_RAW_POSITIONS


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawPositions))


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { rawPositions } = await exchange.position!.listRaw()


    // validating
    expect(rawPositions).to.deep.eq(mockedRawPositions)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitmexEndpoints(exchange.settings).position.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
