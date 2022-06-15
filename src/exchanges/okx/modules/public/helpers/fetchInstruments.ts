import { getOkxEndpoints } from '../../../okxSpecs'
import { IOkxFetchInstrumentsHelperParams, IOkxFetchInstrumentsHelperReturns } from '../../../schemas/IOkxHelperSchema'
import { IOkxSymbolSchema } from '../../../schemas/IOkxSymbolSchema'



export const fetchInstruments = async (
  params: IOkxFetchInstrumentsHelperParams,
): Promise<IOkxFetchInstrumentsHelperReturns> => {

  const {
    http,
    settings,
    type,
  } = params

  const instruments = await http.publicRequest<IOkxSymbolSchema[]>({
    url: getOkxEndpoints(settings).symbol.list(type),
  })

  return {
    instruments,
  }
}
