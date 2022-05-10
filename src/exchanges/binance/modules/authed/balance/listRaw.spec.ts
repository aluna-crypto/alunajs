import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { binanceAuthed } from '../../../binanceAuthed'
import { binanceHttp } from '../../../binanceHttp'
import { getbinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_BALANCES } from '../../../test/fixtures/binanceBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list binance raw balances just fine', async () => {

    // preparing data
    const mockedBalances = BINANCE_RAW_BALANCES


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: binanceHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedBalances))


    // executing
    const exchange = new binanceAuthed({ credentials })

    const { rawBalances } = await exchange.balance.listRaw()


    // validating
    expect(rawBalances).to.deep.eq(mockedBalances)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getbinanceEndpoints(exchange.settings).balance.list,
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
