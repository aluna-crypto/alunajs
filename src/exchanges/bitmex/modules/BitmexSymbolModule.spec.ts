import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { BitmexHttp } from '../BitmexHttp'
import { BitmexSpecs } from '../BitmexSpecs'
import {
  BITMEX_PARSED_SYMBOLS,
  BITMEX_RAW_SYMBOLS,
} from '../test/bitmexSymbols'
import { BitmexSymbolModule } from './BitmexSymbolModule'



describe.only('BitmexSymbolModule', () => {

  it('should list Bitmex raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      BitmexHttp,
      'publicRequest',
      Promise.resolve(BITMEX_RAW_SYMBOLS),
    )

    const rawSymbols = await BitmexSymbolModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.deep.eq({
      url: `${BitmexSpecs.connectApiUrl}/instrument/active`,
    })

    expect(rawSymbols).to.be.eq(BITMEX_RAW_SYMBOLS)

  })

  it('should parse many Bitmex raw symbols just fine', () => {

    const parseMock = ImportMock.mockFunction(
      BitmexSymbolModule,
      'parse',
    )

    each(BITMEX_PARSED_SYMBOLS, (rawSymbol, i) => {

      parseMock.onCall(i).returns(rawSymbol)

    })


    const rawSymbols = BitmexSymbolModule.parseMany({
      rawSymbols: BITMEX_RAW_SYMBOLS,
    })

    expect(parseMock.callCount).to.deep.eq(BITMEX_PARSED_SYMBOLS.length)
    expect(rawSymbols).to.deep.eq(BITMEX_PARSED_SYMBOLS)

  })

})
