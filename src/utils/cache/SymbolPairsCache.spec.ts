import { expect } from 'chai'
import NodeCache from 'node-cache'
import { ImportMock } from 'ts-mock-imports'

import { Bitfinex } from '../../exchanges/bitfinex/Bitfinex'
import { IAlunaMarketSchema } from '../../lib/schemas/IAlunaMarketSchema'
import {
  ICachedSymbolPairsDictionary,
  SymbolPairsCache,
} from './SymbolPairsCache'



describe('SymbolPairsCache', () => {

  const symbolPair = 'LTCBTC'
  const exchangeId = 'exchangeId'

  it('should set data for exchange when not present in the cache', async () => {

    const mockedDictionary: ICachedSymbolPairsDictionary = {
      [symbolPair]: {
        baseSymbolId: 'LTC',
        quoteSymbolId: 'BTC',
      },
    }

    const setMock = ImportMock.mockFunction(
      SymbolPairsCache.prototype,
      'set',
      Promise.resolve(mockedDictionary),
    )

    const symbolPairsDictionary = await SymbolPairsCache.getInstance().get({
      exchangeId,
      symbolPair,
    })

    expect(setMock.callCount).to.be.eq(1)
    expect(symbolPairsDictionary).to.deep.eq(mockedDictionary)


    const symbolPairsDictionary2 = await SymbolPairsCache.getInstance().get({
      exchangeId,
      symbolPair: 'AnotherSymbol',
    })

    expect(setMock.callCount).to.be.eq(2)
    expect(symbolPairsDictionary2).to.deep.eq(mockedDictionary)

  })

  it('should just return the data if is already cached', async () => {

    const mockedCache = new NodeCache({
      stdTTL: 1000 * 60,
    })

    const mockedSymbolPairClass = {
      symbolPairsDictionaryCache: mockedCache,
      get: SymbolPairsCache.prototype.get,
      set: SymbolPairsCache.prototype.set,
    }

    ImportMock.mockFunction(
      SymbolPairsCache,
      'getInstance',
      mockedSymbolPairClass,
    )

    const mockedDictionary: ICachedSymbolPairsDictionary = {
      [symbolPair]: {
        baseSymbolId: 'LTC',
        quoteSymbolId: 'BTC',
      },
    }

    mockedCache.set(exchangeId, mockedDictionary)

    const setMock = ImportMock.mockFunction(
      SymbolPairsCache.prototype,
      'set',
      mockedDictionary,
    )

    // call 1
    const symbolPairsDictionary = await SymbolPairsCache.getInstance().get({
      exchangeId,
      symbolPair,
    })

    expect(symbolPairsDictionary).to.deep.eq(mockedDictionary)
    expect(setMock.callCount).to.be.eq(0)

    // call 2
    await SymbolPairsCache.getInstance().get({
      exchangeId,
      symbolPair,
    })

    // call 3
    await SymbolPairsCache.getInstance().get({
      exchangeId,
      symbolPair,
    })

    // call 4
    await SymbolPairsCache.getInstance().get({
      exchangeId,
      symbolPair,
    })

    expect(setMock.callCount).to.be.eq(0)

  })

  it(
    'should set data by calling fetch market for the given exchange id',
    async () => {

      const symbolPair = 'LTCBTC'

      const parsedMarket = {
        symbolPair,
        baseSymbolId: 'LTC',
        quoteSymbolId: 'BTC',
      } as IAlunaMarketSchema

      const listMarketMock = ImportMock.mockFunction(
        Bitfinex.Market,
        'list',
        Promise.resolve([parsedMarket]),
      )

      const symbolPairsDictionary = await SymbolPairsCache.getInstance().get({
        exchangeId: Bitfinex.ID,
        symbolPair,
      })

      expect(listMarketMock.callCount).to.be.eq(1)

      expect(symbolPairsDictionary).to.deep.eq({
        [symbolPair]: {
          baseSymbolId: 'LTC',
          quoteSymbolId: 'BTC',
        },
      })

    },
  )

})
