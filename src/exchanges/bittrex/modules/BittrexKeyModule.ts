import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsReturns,
  IAlunaKeyModule,
  IAlunaKeyParseDetailsReturns,
  IAlunaKeyParsePermissionsReturns,
} from '../../../lib/modules/IAlunaKeyModule'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../../lib/schemas/IAlunaKeySchema'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { BittrexOrderTimeInForceEnum } from '../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../enums/BittrexOrderTypeEnum'
import { BittrexSideEnum } from '../enums/BittrexSideEnum'
import { IBittrexBalanceSchema } from '../schemas/IBittrexBalanceSchema'
import { IBittrexKeySchema } from '../schemas/IBittrexKeySchema'



export class BittrexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IBittrexKeySchema,
  }): IAlunaKeyParsePermissionsReturns {

    const { rawKey } = params

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    delete rawKey.accountId

    Object.assign(alunaPermissions, rawKey)

    return {
      key: alunaPermissions,
      apiRequestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    BittrexLog.info('fetching Bittrex key permissions')

    const INVALID_PERMISSION_MESSAGE = 'INVALID_PERMISSION'
    const BAD_REQUEST_MESSAGE = 'BAD_REQUEST'

    const { keySecret } = this.exchange

    let apiRequestCount = 0

    const permissions: IBittrexKeySchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    try {

      const { apiRequestCount: requestCount } = await BittrexHttp
        .privateRequest<IBittrexBalanceSchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_BITTREX_URL}/balances`,
          keySecret,
        })

      permissions.read = true
      apiRequestCount += requestCount

    } catch (error) {

      if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

        permissions.read = false

      } else {

        throw error

      }

    }

    try {

      const requestBody = {
        marketSymbol: 'BTCEUR',
        direction: BittrexSideEnum.BUY,
        type: BittrexOrderTypeEnum.MARKET,
        quantity: 0,
        timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
        useAwards: false,
      }

      // need to assign the apiRequestCount before because the request will fail
      apiRequestCount += 1

      await BittrexHttp
        .privateRequest<IBittrexBalanceSchema>({
          verb: AlunaHttpVerbEnum.POST,
          url: `${PROD_BITTREX_URL}/orders`,
          keySecret,
          body: requestBody,
        })

    } catch (error) {

      if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

        permissions.trade = false

      } else if (error.metadata?.code === BAD_REQUEST_MESSAGE) {

        permissions.trade = true

      } else {

        throw error

      }

    }

    try {

      const { data: account, apiRequestCount: requestCount } = await BittrexHttp
        .privateRequest<IBittrexKeySchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_BITTREX_URL}/account`,
          keySecret,
        })

      apiRequestCount += requestCount

      permissions.accountId = account.accountId

    } catch (error) {

      BittrexLog.error(error)

      throw error

    }

    const {
      key: details,
      apiRequestCount: parseDetailsCount,
    } = this.parseDetails({ rawKey: permissions })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + parseDetailsCount

    return {
      key: details,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public parseDetails (params: {
    rawKey: IBittrexKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    BittrexLog.info('parsing Bittrex key details')

    const {
      rawKey,
    } = params

    const {
      accountId,
    } = rawKey

    let apiRequestCount = 0

    const {
      key: parsedPermissions,
      apiRequestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    apiRequestCount += 1

    this.details = {
      meta: rawKey,
      accountId,
      permissions: parsedPermissions,
    }

    const totalApiRequestCount = parsePermissionsCount + apiRequestCount

    return {
      key: this.details,
      apiRequestCount: totalApiRequestCount,
    }

  }

}
