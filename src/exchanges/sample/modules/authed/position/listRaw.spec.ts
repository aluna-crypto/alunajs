import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { SampleHttp } from '../../../SampleHttp'
import { getSampleEndpoints } from '../../../sampleSpecs'
import { SAMPLE_RAW_POSITIONS } from '../../../test/fixtures/samplePositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list raw positions just fine', async () => {

    // preparing data
    const mockedRawPositions = SAMPLE_RAW_POSITIONS


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: SampleHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawPositions))


    // executing
    const exchange = new SampleAuthed({ credentials })

    const { rawPositions } = await exchange.position!.listRaw()


    // validating
    expect(rawPositions).to.deep.eq(mockedRawPositions)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getSampleEndpoints(exchange.settings).position.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
