import { IAlunaSymbol } from '../../../../lib/modules/IAlunaSymbol'
import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import { ValrPublicRequest } from '../requests/ValrPublicRequest'
import { IValrSymbolSchema } from '../schemas/IValrSymbolSchema'



export class ValrSymbol extends ValrPublicRequest implements IAlunaSymbol {

  public async list (): Promise<IAlunaSymbolSchema[]> {

    const rawSymbols = await this.get<IValrSymbolSchema[]>({
      url: 'https://api.valr.com/v1/public/currencies',
    })

    const parsedSymbols = this.parseMany({ rawSymbols })

    return parsedSymbols
  }



  public parse (
    params: {
      rawSymbol: IValrSymbolSchema,
    }
  ): IAlunaSymbolSchema {
    const { rawSymbol } = params

    return {
      acronym: rawSymbol.shortName,
      name: rawSymbol.longName,
    }
  }



  public parseMany (
    params: {
      rawSymbols: IValrSymbolSchema[],
    },
  ): IAlunaSymbolSchema[] {
    return params.rawSymbols.map((rawSymbol: IValrSymbolSchema) =>
      this.parse({ rawSymbol })
    )
  }

}
