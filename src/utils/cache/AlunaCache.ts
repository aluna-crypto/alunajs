import stableStringify from 'fast-json-stable-stringify'
import { sha512 } from 'js-sha512'
import NodeCache from 'node-cache'



export class AlunaCache {

  static cache: NodeCache = new NodeCache({
    stdTTL: 60,
  })

  static hashCacheKey(params: {
    prefix: string
    args: any
  }) {

    const {
      args,
      prefix,
    } = params

    const hash = sha512.hex(stableStringify(args))
    const cacheKey = `${prefix}:${hash}`

    return cacheKey

  }

}
