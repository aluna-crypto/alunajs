import {
  IAlunaMarketGetParams,
  IAlunaMarketGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'



export async function getRaw (
  params: IAlunaMarketGetParams,
): Promise<IAlunaMarketGetRawReturns> {

  return params as any

}
