import {
  IAlunaMarketListParams,
  IAlunaMarketListReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'



export async function list (
  params: IAlunaMarketListParams = {},
): Promise<IAlunaMarketListReturns> {

  return params as any

}
