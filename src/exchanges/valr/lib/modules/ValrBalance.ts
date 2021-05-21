import { IAlunaBalance } from '../../../../lib/modules/IAlunaBalance'
import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import { ValrPrivateRequest } from '../requests/ValrPrivateRequest'
import { IValrBalanceSchema } from '../schemas/IValrBalanceSchema'

export class ValrBalance extends ValrPrivateRequest implements IAlunaBalance {
  public async list(): Promise<IAlunaBalanceSchema[]> {
    const rawBalances = await this.post<IValrBalanceSchema[]>({
      url: 'https://api.valr.com/v1/account/balances',
      path: '/v1/account/balances',
    })

    const parsedBalances = this.parseMany({ rawBalances })

    return parsedBalances
  }

  public parse(params: {
    rawBalance: IValrBalanceSchema
  }): IAlunaBalanceSchema {
    // TODO: implement me
    const x: any = params
    return x
  }

  public parseMany(params: {
    rawBalances: IValrBalanceSchema[]
  }): IAlunaBalanceSchema[] {
    return params.rawBalances.map((rawBalance: IValrBalanceSchema) =>
      this.parse({ rawBalance }),
    )
  }
}
