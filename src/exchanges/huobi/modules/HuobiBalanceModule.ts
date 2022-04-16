import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import {
  IAlunaBalanceListRawReturns,
  IAlunaBalanceListReturns,
  IAlunaBalanceModule,
  IAlunaBalanceParseManyReturns,
  IAlunaBalanceParseReturns,
} from '../../../lib/modules/IAlunaBalanceModule'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { AlunaSymbolMapping } from '../../../utils/mappings/AlunaSymbolMapping'
import { Huobi } from '../Huobi'
import { HuobiHttp } from '../HuobiHttp'
import { HuobiLog } from '../HuobiLog'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import {
  HuobiAccountTypeEnum,
  IHuobiBalanceListSchema,
  IHuobiBalanceSchema,
  IHuobiUserAccountSchema,
} from '../schemas/IHuobiBalanceSchema'



export class HuobiBalanceModule extends AAlunaModule implements IAlunaBalanceModule {

  public async listRaw()
    : Promise<IAlunaBalanceListRawReturns<IHuobiBalanceListSchema>> {

    HuobiLog.info('fetching Huobi balances')

    const { keySecret } = this.exchange

    const {
      data: accounts,
      requestCount,
    } = await HuobiHttp
      .privateRequest<IHuobiUserAccountSchema[]>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_HUOBI_URL}/v1/account/accounts`,
        keySecret,
      })

    const spotAccount = accounts.find(
      (account) => account.type === HuobiAccountTypeEnum.SPOT,
    )

    if (!spotAccount) {

      throw new AlunaError({
        message: 'spot account not found',
        code: AlunaAccountsErrorCodes.TYPE_NOT_FOUND,
      })

    }

    const { id: accountId } = spotAccount

    const {
      data: accountBalances,
      requestCount: requestCount2,
    } = await HuobiHttp
      .privateRequest<IHuobiBalanceSchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_HUOBI_URL}/v1/account/accounts/${accountId}/balance`,
        keySecret,
      })

    const { list } = accountBalances

    const totalRequestCount = requestCount + requestCount2

    return {
      rawBalances: list,
      requestCount: totalRequestCount,
    }

  }



  public async list(): Promise<IAlunaBalanceListReturns> {

    const requestCount = 0

    const {
      requestCount: listRawCount,
      rawBalances,
    } = await this.listRaw()

    const {
      balances: parsedBalances,
      requestCount: parseManyCount,
    } = this.parseMany({ rawBalances })

    HuobiLog.info(`parsed ${parsedBalances.length} balances for Huobi`)

    const totalRequestCount = requestCount
      + parseManyCount
      + listRawCount

    return {
      balances: parsedBalances,
      requestCount: totalRequestCount,
    }

  }



  public parse(params: {
    rawBalance: IHuobiBalanceListSchema,
  }): IAlunaBalanceParseReturns {

    const { rawBalance } = params

    const {
      currency,
      balance: total,
    } = rawBalance

    const symbolMappings = Huobi.settings.mappings

    const symbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: currency,
      symbolMappings,
    })

    const parsedBalance: IAlunaBalanceSchema = {
      symbolId,
      account: AlunaAccountEnum.EXCHANGE,
      available: parseFloat(total),
      total: parseFloat(total),
      meta: rawBalance,
    }

    return {
      balance: parsedBalance,
      requestCount: 0,
    }

  }



  public parseMany(params: {
    rawBalances: IHuobiBalanceListSchema[],
  }): IAlunaBalanceParseManyReturns {

    const { rawBalances } = params

    let requestCount = 0

    const parsedBalances = rawBalances.reduce<IAlunaBalanceSchema[]>(
      (accumulator, rawBalance) => {

        const {
          balance,
        } = rawBalance

        const total = parseFloat(balance)

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