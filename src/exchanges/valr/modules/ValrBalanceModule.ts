import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { AccountEnum } from '@lib/enums/AccountEnum'
import { HttpVerbEnum } from '@lib/enums/HtttpVerbEnum'
import { IAlunaBalanceModule } from '@lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '@lib/schemas/IAlunaBalanceSchema'

import { IValrBalanceSchema } from '../schemas/IValrBalanceSchema'
import { ValrHttp } from '../ValrHttp'



export class ValrBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  async listRaw (): Promise<IValrBalanceSchema[]> {

    const rawBalances = await ValrHttp.privateRequest<IValrBalanceSchema[]>({
      verb: HttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/account/balances',
      keySecret: this.exchange.keySecret,
    })

    return rawBalances

  }



  async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()
    const parsedBalances = this.parseMany({ rawBalances })

    return parsedBalances

  }



  parse (params: {
    rawBalance: IValrBalanceSchema,
  }): IAlunaBalanceSchema {

    const {
      rawBalance,
    } = params

    return {
      symbolAcronym: rawBalance.currency,
      account: AccountEnum.EXCHANGE,
      available: Number(rawBalance.available),
      total: Number(rawBalance.total),
    }

  }



  parseMany (params: {
    rawBalances: IValrBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const {
      rawBalances,
    } = params

    const parsedBalances = rawBalances.reduce((cumulator, current) => {

      if (parseFloat(current.total) > 0) {

        const parsedBalance = this.parse({
          rawBalance: current,
        })

        cumulator.push(parsedBalance)

      }

      return cumulator

    }, [] as IAlunaBalanceSchema[])

    return parsedBalances

  }

}
