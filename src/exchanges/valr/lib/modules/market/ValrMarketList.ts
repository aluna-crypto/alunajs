import { ValrPublicRequest } from '../../requests/ValrPublicRequest'
import { IValrCurrencyPairs } from '../../schemas/IValrCurrencyPairs'
import { IValrMarketSchema } from '../../schemas/IValrMarketSchema'



interface IResponse {
  rawMarkets: IValrMarketSchema[]
  rawSymbolPairs: IValrCurrencyPairs[]
}



export class ValrMarketList {


  private requestHandler: ValrPublicRequest


  constructor (params: {
    publicRequest: ValrPublicRequest
  }) {

    this.requestHandler = params.publicRequest

  }

  async list (): Promise<IResponse> {

    const rawMarkets = await this.requestHandler.get<IValrMarketSchema[]>({
      url: 'https://api.valr.com/v1/public/marketsummary',
    })

    const rawSymbolPairs = await this.requestHandler.get<IValrCurrencyPairs[]>({
      url: 'https://api.valr.com/v1/public/pairs',
    })

    return {
      rawMarkets,
      rawSymbolPairs,
    }

  }

}
