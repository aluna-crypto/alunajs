import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { POLONIEX_KEY_PERMISSIONS } from '../../../test/fixtures/poloniexKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Poloniex key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: POLONIEX_KEY_PERMISSIONS,
      meta: {},
    }

    // mocking
    const http = new PoloniexHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.returns(Promise.resolve(POLONIEX_KEY_PERMISSIONS))

    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new PoloniexAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getPoloniexEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: POLONIEX_KEY_PERMISSIONS,
    })

  })

})
