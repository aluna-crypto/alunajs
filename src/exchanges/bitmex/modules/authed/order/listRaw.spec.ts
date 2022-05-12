import { expect } from 'chai'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockList } from '../../../../../../test/mocks/exchange/modules/mockList'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import * as listMod from '../../public/market/list'



describe(__filename, () => {

  it('should list Bitmex raw orders just fine', async () => {

    // mocking
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve(BITMEX_RAW_ORDERS))

    const { list } = mockList({ module: listMod })
    list.returns(Promise.resolve({ markets: PARSED_MARKETS }))


    // executing
    const settings: IAlunaSettingsSchema = {}
    const exchange = new BitmexAuthed({ credentials, settings })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq({
      bitmexOrders: BITMEX_RAW_ORDERS,
      markets: PARSED_MARKETS,
    })

    expect(list.callCount).to.be.eq(1)
    expect(list.firstCall.args[0]).to.deep.eq({
      http: new BitmexHttp({}),
    })

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBitmexEndpoints(settings).order.list,
      credentials,
      body: { filter: { open: true } },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
