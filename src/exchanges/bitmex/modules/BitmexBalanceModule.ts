import { map } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaBalanceModule } from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { BitmexSpecs } from '../BitmexSpecs'
import { IBitmexBalanceSchema } from '../schemas/IBitmexBalanceSchema'
import { BitmexBalanceParser } from '../schemas/parsers/BitmexBalanceParser'



export class BitmexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IBitmexBalanceSchema[]> {

    BitmexLog.info('fetching BitMEX balances')

    const { privateRequest } = BitmexHttp

    const rawBalances = await privateRequest<IBitmexBalanceSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${BitmexSpecs.connectApiUrl}/user/margin`,
      body: { currency: 'all' },
      keySecret: this.exchange.keySecret,
    })

    return rawBalances

  }

  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    return parsedBalances

  }

  public parse (params: {
    rawBalance: IBitmexBalanceSchema,
  }): IAlunaBalanceSchema {

    const { rawBalance } = params

    const parsedBalance = BitmexBalanceParser.parse({
      rawBalance,
    })

    return parsedBalance

  }

  public parseMany (params: {
    rawBalances: IBitmexBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = map(rawBalances, (rawBalance) => {

      const parsedBalance = this.parse({
        rawBalance,
      })

      return parsedBalance

    })

    BitmexLog.info(`parsed ${parsedBalances.length} balances for BitMEX`)

    return parsedBalances

  }

}
