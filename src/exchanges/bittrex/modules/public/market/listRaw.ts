import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'



export async function listRaw (
  params: IAlunaMarketListParams,
): Promise<IAlunaMarketListRawReturns> {

  return params as any

}
