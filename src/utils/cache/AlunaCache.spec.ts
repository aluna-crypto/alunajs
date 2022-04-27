import { expect } from 'chai'

import { AlunaCache } from './AlunaCache'



describe(__filename, () => {


  it('should export global cache with default ttl', () => {

    expect(AlunaCache.cache.options.stdTTL).to.eq(60)

  })

  it('should sort and hash a cache key based on prefix and params', () => {

    const cacheKey1 = AlunaCache.hashCacheKey({
      prefix: 'ExchangeHttp.publicRequest',
      args: {
        a: 1,
        b: {
          ba: 1,
          bd: 2,
        },
        c: 5,
      },
    })

    const cacheKey2 = AlunaCache.hashCacheKey({
      prefix: 'ExchangeHttp.publicRequest',
      args: {
        c: 5,
        a: 1,
        b: {
          bd: 2,
          ba: 1,
        },
      },
    })

    const cacheKey3 = AlunaCache.hashCacheKey({
      prefix: 'ExchangeHttp.publicRequest',
      args: { a: 1, c: 2 },
    })

    expect(cacheKey1).to.match(/ExchangeHttp.publicRequest:.+/)
    expect(cacheKey2).to.eq(cacheKey1)
    expect(cacheKey3).not.to.eq(cacheKey1)

  })

})
