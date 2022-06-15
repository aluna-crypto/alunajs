import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { OkxAuthed } from '../../../OkxAuthed'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_RAW_POSITIONS } from '../../../test/fixtures/okxPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list raw positions just fine', async () => {

    // preparing data
    const mockedRawPositions = OKX_RAW_POSITIONS


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawPositions))


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { rawPositions } = await exchange.position!.listRaw()


    // validating
    expect(rawPositions).to.deep.eq(mockedRawPositions)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getOkxEndpoints(exchange.settings).position.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
