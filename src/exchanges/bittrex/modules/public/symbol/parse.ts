import {
  IAlunaSymbolParseParams,
  IAlunaSymbolParseReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { BittrexHttp } from '../../../BittrexHttp'
import { bittrexBaseSpecs } from '../../../bittrexSpecs'



export async function parse (
  params: IAlunaSymbolParseParams,
): Promise<IAlunaSymbolParseReturns> {

  const {
    rawSymbol,
    http = new BittrexHttp(),
  } = params

  const {
    symbol,
    name,
  } = rawSymbol

  const parsedSymbol: IAlunaSymbolSchema = {
    // Use symbol mapping
    id: symbol,
    name,
    exchangeId: bittrexBaseSpecs.id,
    meta: rawSymbol,
  }

  const { requestCount } = http

  return {
    symbol: parsedSymbol,
    requestCount,
  }

}
