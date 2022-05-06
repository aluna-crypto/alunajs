import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { GateAuthed } from '../../../GateAuthed'
import { GateHttp } from '../../../GateHttp'
import { gateEndpoints } from '../../../gateSpecs'
import { GATE_KEY_PERMISSIONS } from '../../../test/fixtures/gateKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Gate key details just fine', async () => {

    // preparing data
    const http = new GateHttp()

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: GATE_KEY_PERMISSIONS,
      meta: {},
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: GateHttp.prototype })

    authedRequest.returns(Promise.resolve(GATE_KEY_PERMISSIONS))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new GateAuthed({ settings: {}, credentials })

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
      url: gateEndpoints.key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: GATE_KEY_PERMISSIONS,
    })

  })

})
