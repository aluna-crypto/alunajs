import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseParams,
  IAlunaMarketParseReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IValrMarketSchema } from '../../../schemas/IValrMarketSchema'



export const parse = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseParams<IValrMarketSchema>,
): IAlunaMarketParseReturns => {

  const { rawMarket } = params

  // TODO: Implement proper parser
  const market: IAlunaMarketSchema = rawMarket as any

  return { market }

}