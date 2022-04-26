import {
  IAlunaSymbolGetParams,
  IAlunaSymbolGetRawReturns,
} from '../../../../../lib/modules/IAlunaSymbolModule'



export async function getRaw (
  params: IAlunaSymbolGetParams,
): Promise<IAlunaSymbolGetRawReturns> {

  return params as any

}
