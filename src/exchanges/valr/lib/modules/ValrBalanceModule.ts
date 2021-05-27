import { AAlunaModule } from '@lib/abstracts/AAlunaModule'
import { AccountEnum } from '@lib/enums/AccountEnum'
import { IAlunaBalanceModule } from '@lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '@lib/schemas/IAlunaBalanceSchema'

import { IValrBalanceSchema } from '../schemas/IValrBalanceSchema'
import { ValrRequest } from '../ValrRequest'



export class ValrBalanceModule
  extends AAlunaModule
  implements IAlunaBalanceModule
{


  async list (): Promise<IAlunaBalanceSchema[]> {


    const rawBalances = await new ValrRequest().get<IValrBalanceSchema[]>({
      url: 'https://api.valr.com/v1/account/balances',
      keySecret: this.exchange.keySecret,
    })

    const parsedBalances = this.parseMany({
      rawBalances,
    })

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
