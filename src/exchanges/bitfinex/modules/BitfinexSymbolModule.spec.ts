// TODO: fix tests for Bitfinex Symbol Module

describe('BitfinexSymbolModule', () => {

  // it('should list Bitfinex raw symbols just fine', async () => {

  //   const requestMock = ImportMock.mockFunction(
  //     BitfinexHttp,
  //     'publicRequest',
  //     Promise.resolve(BITFINEX_RAW_SYMBOLS),
  //   )

  //   const rawSymbols = await BitfinexSymbolModule.listRaw()

  //   expect(rawSymbols.length).to.eq(1)
  //   expect(rawSymbols).to.deep.eq(BITFINEX_RAW_SYMBOLS)

  //   const tuplesArr = BITFINEX_RAW_SYMBOLS[0]

  //   expect(tuplesArr.length).to.be.eq(6)

  //   tuplesArr.forEach((tuple) => {

  //     const [id, name] = tuple

  //     expect(id).to.be.ok
  //     expect(name).to.be.ok

  //   })

  //   expect(requestMock.callCount).to.be.eq(1)

  // })

  // it('should list Bitfinex parsed symbols just fine', async () => {

  //   const listRawMock = ImportMock.mockFunction(
  //     BitfinexSymbolModule,
  //     'listRaw',
  //     Promise.resolve(BITFINEX_RAW_SYMBOLS),
  //   )

  //   const parseManyMock = ImportMock.mockFunction(
  //     BitfinexSymbolModule,
  //     'parseMany',
  //     BITFINEX_PARSED_SYMBOLS,
  //   )

  //   const rawSymbols = await BitfinexSymbolModule.list()

  //   expect(rawSymbols.length).to.eq(6)
  //   expect(rawSymbols).to.deep.eq(BITFINEX_PARSED_SYMBOLS)

  //   expect(rawSymbols[0].exchangeId).to.be.eq(Bitfinex.ID)
  //   expect(rawSymbols[0].id).to.be.eq(BITFINEX_PARSED_SYMBOLS[0].id)
  //   expect(rawSymbols[0].name).to.be.eq(BITFINEX_PARSED_SYMBOLS[0].name)

  //   expect(rawSymbols[1].exchangeId).to.be.eq(Bitfinex.ID)
  //   expect(rawSymbols[1].id).to.be.eq(BITFINEX_PARSED_SYMBOLS[1].id)
  //   expect(rawSymbols[1].name).to.be.eq(BITFINEX_PARSED_SYMBOLS[1].name)

  //   expect(rawSymbols[2].exchangeId).to.be.eq(Bitfinex.ID)
  //   expect(rawSymbols[2].id).to.be.eq(BITFINEX_PARSED_SYMBOLS[2].id)
  //   expect(rawSymbols[2].name).to.be.eq(BITFINEX_PARSED_SYMBOLS[2].name)

  //   expect(listRawMock.callCount).to.eq(1)

  //   expect(parseManyMock.callCount).to.eq(1)
  //   expect(parseManyMock.calledWith({
  //     rawSymbols: BITFINEX_RAW_SYMBOLS,
  //   })).to.be.ok

  // })

  // it('should parse a Bitfinex symbol just fine', async () => {

  //   const parsedSymbol1 = BitfinexSymbolModule.parse({
  //     rawSymbol: BITFINEX_RAW_SYMBOLS[0][0],
  //   })

  //   expect(parsedSymbol1.exchangeId).to.be.eq(Bitfinex.ID)
  //   expect(parsedSymbol1.id).to.be.eq(BITFINEX_RAW_SYMBOLS[0][0][0])
  //   expect(parsedSymbol1.name).to.be.eq(BITFINEX_RAW_SYMBOLS[0][0][1])

  //   const parsedSymbol2 = BitfinexSymbolModule.parse({
  //     rawSymbol: BITFINEX_RAW_SYMBOLS[0][1],
  //   })

  //   expect(parsedSymbol2.exchangeId).to.be.eq(Bitfinex.ID)
  //   expect(parsedSymbol2.id).to.be.eq(BITFINEX_RAW_SYMBOLS[0][1][0])
  //   expect(parsedSymbol2.name).to.be.eq(BITFINEX_RAW_SYMBOLS[0][1][1])

  // })

  // it('should parse many Bitfinex symbols just fine', async () => {

  //   const parseMock = ImportMock.mockFunction(
  //     BitfinexSymbolModule,
  //     'parse',
  //   )

  //   const rawSymbols = []

  //   BITFINEX_PARSED_SYMBOLS.forEach((mockedParsed, index) => {

  //     parseMock.onCall(index).returns(mockedParsed)

  //     rawSymbols.push([] as any)

  //   })

  //   const parsedSymbols = BitfinexSymbolModule.parseMany({
  //     rawSymbols: [rawSymbols],
  //   })

  //   expect(parsedSymbols.length).to.be.eq(BITFINEX_PARSED_SYMBOLS.length)

  //   parsedSymbols.forEach((parsed, index) => {

  //     expect(parsed.exchangeId).to.be.eq(Bitfinex.ID)
  //     expect(parsed.id).to.be.eq(BITFINEX_PARSED_SYMBOLS[index].id)
  //     expect(parsed.name).to.be.eq(BITFINEX_PARSED_SYMBOLS[index].name)

  //   })

  // })

})
