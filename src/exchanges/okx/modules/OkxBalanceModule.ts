import BigNumber from 'bignumber.js'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaBalanceListRawReturns,
  IAlunaBalanceListReturns,
  IAlunaBalanceModule,
  IAlunaBalanceParseManyReturns,
  IAlunaBalanceParseReturns,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Okx } from '../Okx'
import { OkxHttp } from '../OkxHttp'
import { OkxLog } from '../OkxLog'
import { PROD_OKX_URL } from '../OkxSpecs'
import { IOkxBalanceListSchema, IOkxBalanceSchema } from '../schemas/IOkxBalanceSchema'



export class OkxBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IOkxBalanceSchema>> {

    OkxLog.info('fetching Okx balances')

    const { keySecret } = this.exchange

    const {
      data: rawBalanceInfo,
      requestCount,
    } = await OkxHttp
      .privateRequest<IOkxBalanceListSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_OKX_URL}/account/balance`,
        keySecret,
      })

    const { details: balances } = rawBalanceInfo[0]

    return {
      rawBalances: balances,
      requestCount,
    }

  }



  public async list (): Promise<IAlunaBalanceListReturns> {

    const requestCount = 0

    const {
      requestCount: listRawCount,
      rawBalances,
    } = await this.listRaw()

    const {
      balances: parsedBalances,
      requestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    OkxLog.info(`parsed ${parsedBalances.length} balances for Okx`)

    const totalRequestCount = requestCount
      + parseManyCount
      + listRawCount

    return {
      balances: parsedBalances,
      requestCount: totalRequestCount,
    }

  }



  public parse (params: {
    rawBalance: IOkxBalanceSchema,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const {
      availBal,
      frozenBal,
      ccy,
    } = rawBalance

    const symbolMappings = Okx.settings.mappings

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: ccy,
      symbolMappings,
    })

    const available = Number(availBal)
    const total = new BigNumber(available)
      .plus(Number(frozenBal))
      .toNumber()

    const parsedBalance = {
      symbolId,
      account: AlunaAccountEnum.MAIN,
      available,
      total,
      meta: rawBalance,
    }

    return {
      balance: parsedBalance,
      requestCount: 0,
    }

  }



  public parseMany (params: {
    rawBalances: IOkxBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let requestCount = 0

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          availBal,
          frozenBal,
        } = rawBalance

        const total = parseFloat(availBal) + parseFloat(frozenBal)

        if (total > 0) {

          const {
            balance: parsedBalance,
            requestCount: parseCount,
          } = this.parse({ rawBalance })

          requestCount += parseCount

          accumulator.push(parsedBalance)

        }

        return accumulator

      },
      [],
    )

    return {
      balances: parsedBalances,
      requestCount,
    }

  }

}
