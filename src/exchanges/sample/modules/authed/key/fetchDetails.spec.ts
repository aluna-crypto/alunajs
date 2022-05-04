import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { SampleAuthed } from '../../../SampleAuthed'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { SAMPLE_KEY_PERMISSIONS } from '../../../test/fixtures/sampleKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Sample key details just fine', async () => {

    // preparing data
    const http = new SampleHttp()

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: SAMPLE_KEY_PERMISSIONS,
      meta: {},
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: SampleHttp.prototype })

    authedRequest.returns(Promise.resolve(SAMPLE_KEY_PERMISSIONS))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns(Promise.resolve({ key: parsedKey }))


    // executing
    const exchange = new SampleAuthed({ settings: {}, credentials })

    const {
      key,
      requestCount,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(key)

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: sampleEndpoints.key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: SAMPLE_KEY_PERMISSIONS,
    })

  })

})
