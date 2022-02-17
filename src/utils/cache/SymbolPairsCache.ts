import { each } from 'lodash'
import NodeCache from 'node-cache'

import { Aluna } from '../../Aluna'



export interface ICachedSymbolPairsDictionary {
  [symbolPair: string]: {
    baseSymbolId: string,
    quoteSymbolId: string,
  }
}



export interface ISymbolPair {
  symbolPair: string
  baseSymbolId: string
  quoteSymbolId: string
}



export class SymbolPairsCache {

  private static instance: SymbolPairsCache

  private symbolPairsDictionaryCache: NodeCache

  private constructor () {

    this.symbolPairsDictionaryCache = new NodeCache({
      stdTTL: 1000 * 60 * 60 * 24,
    })

  }

  public static getInstance () {

    if (!SymbolPairsCache.instance) {

      SymbolPairsCache.instance = new SymbolPairsCache()

    }

    return SymbolPairsCache.instance

  }

  async set (params: {
    exchangeId: string,
  }): Promise<ICachedSymbolPairsDictionary> {

    const { exchangeId } = params

    const symbolPairs = await this.fetchData({ exchangeId })

    const symbolPairsDictionary: ICachedSymbolPairsDictionary = {}

    each(symbolPairs, (pair) => {

      const {
        symbolPair,
        baseSymbolId,
        quoteSymbolId,
      } = pair

      symbolPairsDictionary[symbolPair] = {
        baseSymbolId,
        quoteSymbolId,
      }

    })

    this.symbolPairsDictionaryCache.set<ICachedSymbolPairsDictionary>(
      exchangeId,
      symbolPairsDictionary,
    )

    return symbolPairsDictionary

  }

  public async get (params: {
    exchangeId: string,
    symbolPair: string,
  }): Promise<ICachedSymbolPairsDictionary> {

    const {
      exchangeId,
      symbolPair,
    } = params

    const cachedSymbolPairs = this.symbolPairsDictionaryCache
      .get<ICachedSymbolPairsDictionary>(exchangeId)

    if (cachedSymbolPairs && cachedSymbolPairs[symbolPair]) {

      return cachedSymbolPairs

    }

    return this.set({ exchangeId })

  }

  private async fetchData (params: {
    exchangeId: string,
  }): Promise<ISymbolPair[]> {

    const { exchangeId } = params

    const markets = await Aluna.static({ exchangeId }).Market.list()

    return markets

  }

}
