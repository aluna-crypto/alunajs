import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_SPOT_BALANCES } from '../../../test/fixtures/binanceBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Binance raw balances just fine', async () => {

    // preparing data
    const mockedBalances = BINANCE_RAW_SPOT_BALANCES

    const requestResponse = {
      balances: mockedBalances,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    authedRequest.returns(Promise.resolve(requestResponse))


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { rawBalances } = await exchange.balance.listRaw()


    // validating
    expect(rawBalances).to.deep.eq(mockedBalances)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBinanceEndpoints(exchange.settings).balance.listSpot,
      credentials,
      weight: 10,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
