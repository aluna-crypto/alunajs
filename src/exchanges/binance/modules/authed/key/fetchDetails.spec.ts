import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { binanceAuthed } from '../../../binanceAuthed'
import { binanceHttp } from '../../../binanceHttp'
import { getbinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_KEY_PERMISSIONS } from '../../../test/fixtures/binanceKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch binance key details just fine', async () => {

    // preparing data
    const http = new binanceHttp({})

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: BINANCE_KEY_PERMISSIONS,
      meta: {},
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: binanceHttp.prototype })

    authedRequest.returns(Promise.resolve(BINANCE_KEY_PERMISSIONS))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new binanceAuthed({ settings: {}, credentials })

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
      url: getbinanceEndpoints(exchange.settings).key.fetchDetails,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: BINANCE_KEY_PERMISSIONS,
    })

  })

})
