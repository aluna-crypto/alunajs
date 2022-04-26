import {
  IAlunaMarketListParams,
  IAlunaMarketListRawReturns,
} from '../../../../../lib/modules/IAlunaMarketModule'



export async function listRaw (
  params: IAlunaMarketListParams,
): Promise<IAlunaMarketListRawReturns> {

  return params as any

}
