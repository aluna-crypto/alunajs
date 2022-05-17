import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import {
  BINANCE_RAW_MARGIN_BALANCES,
  BINANCE_RAW_SPOT_BALANCES,
} from '../../../test/fixtures/binanceBalances'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Binance raw balances just fine', async () => {

    // preparing data
    const balances = BINANCE_RAW_SPOT_BALANCES
    const userAssets = BINANCE_RAW_MARGIN_BALANCES


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve({ balances }))
    authedRequest.onSecondCall().returns(Promise.resolve({ userAssets }))


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { rawBalances } = await exchange.balance.listRaw()


    // validating
    expect(rawBalances).to.deep.eq({
      spotBalances: balances,
      marginBalances: userAssets,
    })

    expect(authedRequest.callCount).to.be.eq(2)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBinanceEndpoints(exchange.settings).balance.listSpot,
      credentials,
      weight: 10,
    })

    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBinanceEndpoints(exchange.settings).balance.listMargin,
      credentials,
      weight: 10,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
