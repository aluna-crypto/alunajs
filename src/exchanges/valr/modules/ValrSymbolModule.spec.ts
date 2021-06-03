import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import {
  VALR_SEEDS,
} from '../test/fixtures'
import { ValrHttp } from '../ValrHttp'
import { ValrSymbolModule } from './ValrSymbolModule'



describe('ValrSymbolModule', () => {

  const valrSymbolModule = ValrSymbolModule.prototype

  const { symbolsSeeds } = VALR_SEEDS

  beforeEach(() => {

    ImportMock.restore()

  })



  it('should list Valr raw symbols just fine', async () => {

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'publicRequest',
      symbolsSeeds.rawSymbols,
    )

    const rawSymbols = await valrSymbolModule.listRaw()

    expect(requestMock.calledOnce).to.be.ok

    expect(rawSymbols.length).to.eq(3)

    expect(rawSymbols[0].symbol).to.be.eq('R')
    expect(rawSymbols[0].shortName).to.be.eq('ZAR')
    expect(rawSymbols[0].longName).to.be.eq('Rand')

    expect(rawSymbols[1].symbol).to.be.eq('BTC')
    expect(rawSymbols[1].shortName).to.be.eq('BTC')
    expect(rawSymbols[1].longName).to.be.eq('Bitcoin')

    expect(rawSymbols[2].symbol).to.be.eq('ETH')
    expect(rawSymbols[2].shortName).to.be.eq('ETH')
    expect(rawSymbols[2].longName).to.be.eq('Ethereum')

  })



  it('should list Valr parsed symbols just fine', async () => {

    const listRawMock = ImportMock.mockFunction(
      valrSymbolModule,
      'listRaw',
      'raw-symbols',
    )

    const parseManyMock = ImportMock.mockFunction(
      valrSymbolModule,
      'parseMany',
      symbolsSeeds.parsedSymbols,
    )


    const rawSymbols = await valrSymbolModule.list()

    expect(listRawMock.callCount).to.eq(1)

    expect(parseManyMock.callCount).to.eq(1)
    expect(parseManyMock.args[0]).to.deep.eq([{ rawSymbols: 'raw-symbols' }])

    expect(rawSymbols.length).to.eq(3)

    expect(rawSymbols[0].id).to.be.eq('ZAR')
    expect(rawSymbols[0].name).to.be.eq('Rand')

    expect(rawSymbols[1].id).to.be.eq('BTC')
    expect(rawSymbols[1].name).to.be.eq('Bitcoin')

    expect(rawSymbols[2].id).to.be.eq('ETH')
    expect(rawSymbols[2].name).to.be.eq('Ethereum')

  })



  it('should parse a Valr symbol just fine', async () => {

    const parsedSymbol = valrSymbolModule.parse({
      rawSymbol: symbolsSeeds.rawSymbols[2],
    })

    expect(parsedSymbol).to.be.ok
    expect(parsedSymbol.id).to.be.eq('ETH')
    expect(parsedSymbol.name).to.be.eq('Ethereum')

  })



  it('should parse many Valr symbols just fine', async () => {

    const parsedSymbols = valrSymbolModule.parseMany({
      rawSymbols: symbolsSeeds.rawSymbols,
    })


    expect(parsedSymbols[0].id).to.be.eq('ZAR')
    expect(parsedSymbols[0].name).to.be.eq('Rand')

    expect(parsedSymbols[1].id).to.be.eq('BTC')
    expect(parsedSymbols[1].name).to.be.eq('Bitcoin')

    expect(parsedSymbols[2].id).to.be.eq('ETH')
    expect(parsedSymbols[2].name).to.be.eq('Ethereum')

  })

})
