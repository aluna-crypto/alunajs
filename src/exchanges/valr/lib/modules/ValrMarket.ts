import { IAlunaMarket } from '../../../../lib/modules/IAlunaMarket'
import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { ValrPublicRequest } from '../requests/ValrPublicRequest'
import { IValrMarketSchema } from '../schemas/IValrMarketSchema'



export class ValrMarket extends ValrPublicRequest implements IAlunaMarket {

  public async list (): Promise <IAlunaMarketSchema[]> {

    const rawMarkets = await this.post<IValrMarketSchema[]>({
      url: '/symbols',
      params: {},
    })

    const parsedMarkets = this.parseMany({ rawMarkets })

    return parsedMarkets

  }



  public parse (
    params: {
      rawMarket: IValrMarketSchema,
    }
  ): IAlunaMarketSchema {

    // TODO: implement me
    const x: any = params
    return x

  }



  public parseMany (
    params: {
      rawMarkets: IValrMarketSchema[],
    }): IAlunaMarketSchema[] {
    return params.rawMarkets.map((rawMarket: IValrMarketSchema) =>
      this.parse({ rawMarket })
    )
  }

}
