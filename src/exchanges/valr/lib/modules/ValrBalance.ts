import { AccountEnum } from 'lib/enums/AccountEnum'

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
    const { rawBalance } = params

    return {
      symbolAcronym: rawBalance.currency,
      account: AccountEnum.EXCHANGE,
      available: Number(rawBalance.available),
      total: Number(rawBalance.total),
    }
  }

  public parseMany(params: {
    rawBalances: IValrBalanceSchema[]
  }): IAlunaBalanceSchema[] {
    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce((cumulator, current) => {
      if (parseFloat(current.total) > 0) {
        const parsedBalance = this.parse({ rawBalance: current })

        cumulator.push(parsedBalance)
      }

      return cumulator
    }, [] as IAlunaBalanceSchema[])

    return parsedBalances
  }
}
