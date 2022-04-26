import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'



export async function get (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetReturns> {

  return params as any

}
