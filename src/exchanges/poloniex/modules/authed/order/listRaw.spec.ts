import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { POLONIEX_RAW_ORDERS_RESPONSE } from '../../../test/fixtures/poloniexOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Poloniex raw orders just fine', async () => {

    // preparing data
    const mockedRawOrders = POLONIEX_RAW_ORDERS_RESPONSE

    const body = new URLSearchParams()

    body.append('command', 'returnOpenOrders')
    body.append('currencyPair', 'all')
    body.append('nonce', '123456')

    // mocking
    ImportMock.mockFunction(
      Date.prototype,
      'getTime',
      123456,
    )

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrders))

    // executing
    const exchange = new PoloniexAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq(mockedRawOrders)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getPoloniexEndpoints(exchange.settings).order.list,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
