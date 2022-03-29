import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceGetTradableBalanceReturns,
  IAlunaBalanceListRawReturns,
  IAlunaBalanceListReturns,
  IAlunaBalanceModule,
  IAlunaBalanceParseManyReturns,
  IAlunaBalanceParseReturns,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { validateParams } from '../../../utils/validation/validateParams'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { BitfinexAccountsAdapter } from '../enums/adapters/BitfinexAccountsAdapter'
import { BitfinexAccountsEnum } from '../enums/BitfinexAccountsEnum'
import { IBitfinexBalanceSchema } from '../schemas/IBitfinexBalanceSchema'
import { BitfinexBalanceParser } from '../schemas/parsers/BitfnexBalanceParser'
import { bitfinexGetTradableBalanceParamsSchema } from '../validation/bitfinexTradableBalanceParamsSchema'



export class BitfinexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw ()
    : Promise<IAlunaBalanceListRawReturns<IBitfinexBalanceSchema>> {

    BitfinexLog.info('fetching Bitfinex balances')

    const { privateRequest } = BitfinexHttp

    const {
      data: rawBalances,
      apiRequestCount,
    } = await privateRequest<IBitfinexBalanceSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/wallets',
      keySecret: this.exchange.keySecret,
    })

    return {
      rawBalances,
      apiRequestCount,
    }

  }

  public async list (): Promise<IAlunaBalanceListReturns> {

    let apiRequestCount = 0

    const {
      rawBalances,
      apiRequestCount: listRawCount,
    } = await this.listRaw()

    apiRequestCount += 1

    const {
      balances: parsedBalances,
      apiRequestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    apiRequestCount += 1

    BitfinexLog.info(`parsed ${parsedBalances.length} balances for Bitfinex`)

    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + parseManyCount

    return {
      balances: parsedBalances,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public parse (params: {
    rawBalance: IBitfinexBalanceSchema,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const parsedBalance = BitfinexBalanceParser.parse({
      rawBalance,
    })

    return {
      balance: parsedBalance,
      apiRequestCount: 1,
    }

  }

  public parseMany (params: {
    rawBalances: IBitfinexBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let apiRequestCount = 0

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {

      const [walletType] = rawBalance

      // skipping 'lending' balances types for now
      if (walletType === BitfinexAccountsEnum.FUNDING) {

        return accumulator

      }

      const {
        balance: parsedBalance,
        apiRequestCount: parseCount,
      } = this.parse({ rawBalance })

      apiRequestCount += parseCount + 1

      accumulator.push(parsedBalance)

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    BitfinexLog.info(`parsed ${parsedBalances.length} Bitfinex balances`)

    return {
      balances: parsedBalances,
      apiRequestCount,
    }

  }

  public async getTradableBalance (
    params: IAlunaBalanceGetTradableBalanceParams,
  ): Promise<IAlunaBalanceGetTradableBalanceReturns> {

    validateParams({
      params,
      schema: bitfinexGetTradableBalanceParamsSchema,
    })

    const {
      rate,
      side,
      account,
      symbolPair,
    } = params

    let apiRequestCount = 0

    const translatedAccount = BitfinexAccountsAdapter.translateToBitfinex({
      from: account!,
    })

    apiRequestCount += 1

    BitfinexLog.info(`fetching Bitfinex tradable balance for ${symbolPair}`)

    const { privateRequest } = BitfinexHttp

    const dir = side === AlunaOrderSideEnum.BUY
      ? 1
      : -1

    const {
      data,
      apiRequestCount: requestCount,
    } = await privateRequest<[number]>({
      url: 'https://api.bitfinex.com/v2/auth/calc/order/avail',
      keySecret: this.exchange.keySecret,
      body: {
        dir,
        symbol: symbolPair,
        rate: rate!.toString(),
        type: translatedAccount,
      },
    })

    apiRequestCount += requestCount

    const [tradableBalance] = data

    return {
      tradableBalance,
      apiRequestCount,
    }

  }

}
