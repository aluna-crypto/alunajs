import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'



export async function getRaw (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetRawReturns> {

  return params as any

}
