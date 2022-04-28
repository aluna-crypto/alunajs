import { OkxSymbolTypeEnum } from '../enums/OkxSymbolTypeEnum'
import { OkxHttp } from '../OkxHttp'
import { PROD_OKX_URL } from '../OkxSpecs'
import { IOkxSymbolSchema } from '../schemas/IOkxSymbolSchema'



export interface IOkxFetchInstrumentsParams {
  type: OkxSymbolTypeEnum
}

export interface IFetchInstrumentsReturns {
  rawSymbols: IOkxSymbolSchema[]
  requestCount: number
}

export const fetchOkxInstruments = async (
  params: IOkxFetchInstrumentsParams,
): Promise<IFetchInstrumentsReturns> => {

  const { type } = params

  const {
    data: rawSymbols,
    requestCount,
  } = await OkxHttp.publicRequest<IOkxSymbolSchema[]>({
    url: `${PROD_OKX_URL}/public/instruments?instType=${type}`,
  })

  return {
    rawSymbols,
    requestCount,
  }

}
