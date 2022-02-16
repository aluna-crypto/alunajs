import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import {
  IAlunaBalanceModule,
  IFetchTradableBalanceParams,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { BitfinexAccountsEnum } from '../enums/BitfinexAccountsEnum'
import { IBitfinexBalanceSchema } from '../schemas/IBitfinexBalanceSchema'
import { BitfinexBalanceParser } from '../schemas/parsers/BitifnexBalanceParser'



export class BitfinexBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw (): Promise<IBitfinexBalanceSchema[]> {

    BitfinexLog.info('fetching Bitfinex balances')

    const { privateRequest } = BitfinexHttp

    const rawBalances = await privateRequest<IBitfinexBalanceSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/wallets',
      keySecret: this.exchange.keySecret,
    })

    return rawBalances

  }

  public async list (): Promise<IAlunaBalanceSchema[]> {

    const rawBalances = await this.listRaw()

    const parsedBalances = this.parseMany({ rawBalances })

    BitfinexLog.info(`parsed ${parsedBalances.length} balances for Bitfinex`)

    return parsedBalances

  }

  public parse (params: {
    rawBalance: IBitfinexBalanceSchema,
  }): IAlunaBalanceSchema {

    const { rawBalance } = params

    const parsedBalance = BitfinexBalanceParser.parse({ rawBalance })

    return parsedBalance

  }

  public parseMany (params: {
    rawBalances: IBitfinexBalanceSchema[],
  }): IAlunaBalanceSchema[] {

    const { rawBalances } = params

    const parsedBalances = rawBalances.reduce((accumulator, rawBalance) => {

      const [walletType] = rawBalance

      // skipping 'lending' balances types for now
      if (walletType === BitfinexAccountsEnum.FUNDING) {

        return accumulator

      }

      const parsedBalance = this.parse({ rawBalance })

      accumulator.push(parsedBalance)

      return accumulator

    }, [] as IAlunaBalanceSchema[])

    BitfinexLog.info(`parsed ${parsedBalances.length} Bitfinex balances`)

    return parsedBalances

  }

  public async fetchTradableBalance (
    params: IFetchTradableBalanceParams,
  ): Promise<number> {

    const {
      rate,
      side,
      symbolPair,
    } = params

    BitfinexLog.info(`fetching Bitfinex tradable balance for ${symbolPair}`)

    const { privateRequest } = BitfinexHttp

    const dir = side === AlunaSideEnum.LONG
      ? 1
      : -1

    const [tradableBalance] = await privateRequest<[number]>({
      url: 'https://api.bitfinex.com/v2/auth/calc/order/avail',
      keySecret: this.exchange.keySecret,
      body: {
        dir,
        rate: rate.toString(),
        symbol: symbolPair,
        type: BitfinexAccountsEnum.MARGIN,
      },
    })

    return tradableBalance

  }

}
