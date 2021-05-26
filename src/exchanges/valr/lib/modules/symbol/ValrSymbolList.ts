import { ValrPublicRequest } from '../../requests/ValrPublicRequest'
import { IValrSymbolSchema } from '../../schemas/IValrSymbolSchema'



export class ValrSymbolList {

  constructor (
    private requestHandler: ValrPublicRequest,
  ) {}

  async list (): Promise<IValrSymbolSchema[]> {

    return this.requestHandler.get<IValrSymbolSchema[]>({
      url: 'https://api.valr.com/v1/public/currencies',
    })

  }

}
