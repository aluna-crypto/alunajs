import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { OkxSymbolTypeEnum } from '../enums/OkxSymbolTypeEnum'
import { OkxHttp } from '../OkxHttp'
import {
  OKX_RAW_SPOT_SYMBOLS,
} from '../test/fixtures/okxSymbol'
import { fetchOkxInstruments } from './FetchOkxInstruments'



describe('OkxSymbolModule', () => {


  it('should list Okx raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      OkxHttp,
      'publicRequest',
      Promise.resolve({
        data: OKX_RAW_SPOT_SYMBOLS,
        requestCount: 1,
      }),
    )

    const { rawSymbols } = await fetchOkxInstruments({
      type: OkxSymbolTypeEnum.SPOT,
    })

    expect(rawSymbols.length).to.eq(4)
    expect(rawSymbols).to.deep.eq(OKX_RAW_SPOT_SYMBOLS)

    expect(requestMock.callCount).to.be.eq(1)

  })

})
