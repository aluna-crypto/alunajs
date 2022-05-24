import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { HUOBI_KEY_PERMISSIONS } from '../../../test/fixtures/huobiKey'
import { mockGetHuobiAccountId } from '../../../test/mocks/mockGetHuobiAccountId'
import * as parseDetailsMod from './parseDetails'
import * as getHuobiAccountIdMod from '../helpers/getHuobiAccountId'



describe(__filename, () => {

  it('should fetch Huobi key details just fine', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const userId = 123456

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: {
        read: true,
        trade: true,
        withdraw: true,
      },
      meta: {},
    }

    const query = new URLSearchParams()
    query.append('uid', userId.toString())

    // mocking
    const http = new HuobiHttp({})

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve(123456))

    authedRequest.onSecondCall().returns(Promise.resolve([HUOBI_KEY_PERMISSIONS]))

    const { wrapper: getHuobiAccountId } = mockGetHuobiAccountId({
      module: getHuobiAccountIdMod,
    })

    getHuobiAccountId.onFirstCall().returns(Promise.resolve({ accountId }))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new HuobiAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails()


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getHuobiEndpoints(exchange.settings).key.fetchUserId,
      credentials,
    })

    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getHuobiEndpoints(exchange.settings).key.fetchDetails,
      credentials,
      query: query.toString(),
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: {
        ...HUOBI_KEY_PERMISSIONS,
        accountId,
        userId,
      },
    })

  })

})
