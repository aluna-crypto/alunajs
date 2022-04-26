import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'



export async function listRaw (
  params: IAlunaSymbolListParams,
): Promise<IAlunaSymbolListRawReturns> {

  return params as any

}
