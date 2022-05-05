import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../../../../lib/schemas/IAlunaKeySchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  BITFINEX_KEY_PERMISSIONS,
  BITFINEX_RAW_KEY,
} from '../../../test/fixtures/bitfinexKey'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Bitfinex key details just fine', async () => {

    // preparing data
    const http = new BitfinexHttp()

    const bitfinexPermissions = BITFINEX_KEY_PERMISSIONS
    const { accountId } = BITFINEX_RAW_KEY

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const permissions: IAlunaKeyPermissionSchema = {
      read: true,
      trade: true,
    }

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions,
      meta: {},
    }


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve(bitfinexPermissions))
    authedRequest.onSecondCall().returns(Promise.resolve([accountId]))

    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new BitfinexAuthed({ settings: {}, credentials })

    const {
      key,
      requestCount,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(key)

    expect(requestCount).to.deep.eq(http.requestCount)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: bitfinexEndpoints.key.fetchDetails,
      credentials,
    })
    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: bitfinexEndpoints.key.account,
      credentials,
    })


    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: BITFINEX_RAW_KEY,
    })

  })

})
