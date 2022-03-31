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
      requestCount,
    } = await privateRequest<IBitfinexBalanceSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/wallets',
      keySecret: this.exchange.keySecret,
    })

    return {
      rawBalances,
      requestCount,
    }

  }

  public async list (): Promise<IAlunaBalanceListReturns> {

    const requestCount = 0

    const {
      rawBalances,
      requestCount: listRawCount,
    } = await this.listRaw()

    const {
      balances: parsedBalances,
      requestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    BitfinexLog.info(`parsed ${parsedBalances.length} balances for Bitfinex`)

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      balances: parsedBalances,
      requestCount: totalRequestCount,
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
      requestCount: 0,
    }

  }

  public parseMany (params: {
    rawBalances: IBitfinexBalanceSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let requestCount = 0

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {

      const [walletType] = rawBalance

      // skipping 'lending' balances types for now
      if (walletType === BitfinexAccountsEnum.FUNDING) {

        return accumulator

      }

      const {
        balance: parsedBalance,
        requestCount: parseCount,
      } = this.parse({ rawBalance })

      requestCount += parseCount

      accumulator.push(parsedBalance)

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    BitfinexLog.info(`parsed ${parsedBalances.length} Bitfinex balances`)

    return {
      balances: parsedBalances,
      requestCount,
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

    const translatedAccount = BitfinexAccountsAdapter.translateToBitfinex({
      from: account!,
    })

    BitfinexLog.info(`fetching Bitfinex tradable balance for ${symbolPair}`)

    const { privateRequest } = BitfinexHttp

    const dir = side === AlunaOrderSideEnum.BUY
      ? 1
      : -1

    const {
      data,
      requestCount,
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

    const [tradableBalance] = data

    return {
      tradableBalance,
      requestCount,
    }

  }

}
