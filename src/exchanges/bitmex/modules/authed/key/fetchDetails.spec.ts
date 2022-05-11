import { expect } from 'chai'

import { PARSED_KEY } from '../../../../../../test/fixtures/parsedKey'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_KEY } from '../../../test/fixtures/bitmexKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Bitmex key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }
    const parsedKey = PARSED_KEY


    // mocking
    const http = new BitmexHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve(BITMEX_RAW_KEY))

    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })
    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new BitmexAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(parsedKey)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBitmexEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: BITMEX_RAW_KEY,
    })

  })

})
