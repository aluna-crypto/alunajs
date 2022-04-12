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
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import {
  BinanceApiKeyPermissions,
  IBinanceKeyAccountSchema,
} from '../schemas/IBinanceKeySchema'



export class BinanceKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IBinanceKeyAccountSchema,
  }): IAlunaKeyParsePermissionsReturns {

    const { rawKey } = params

    const { permissions } = rawKey

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    permissions.forEach((permission: string) => {

      switch (permission) {

        case BinanceApiKeyPermissions.SPOT:
          alunaPermissions.read = true
          alunaPermissions.trade = rawKey.canTrade
          alunaPermissions.withdraw = rawKey.canWithdraw
          break

        default:

          BinanceLog.info(`Unknown permission '${permission}' found on Binance`
            .concat('permissions API response'))
          break

      }

    })

    return {
      key: alunaPermissions,
      requestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    BinanceLog.info('fetching Binance key permissionsa')

    let rawKey: IBinanceKeyAccountSchema
    let requestCount = 0

    try {

      const { keySecret } = this.exchange

      const {
        data: keyInfo,
        requestCount: privateRequestCount,
      } = await BinanceHttp
        .privateRequest<IBinanceKeyAccountSchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_BINANCE_URL}/api/v3/account`,
          keySecret,
        })

      rawKey = keyInfo
      requestCount += privateRequestCount

    } catch (error) {

      BinanceLog.error(error.message)

      throw error

    }

    const {
      key: details,
      requestCount: parseDetailsRequestCount,
    } = this.parseDetails({ rawKey })

    const totalRequestCount = requestCount + parseDetailsRequestCount

    return {
      key: details,
      requestCount: totalRequestCount,
    }

  }

  public parseDetails (params: {
    rawKey: IBinanceKeyAccountSchema,
  }): IAlunaKeyParseDetailsReturns {

    BinanceLog.info('parsing Binance key details')

    const {
      rawKey,
    } = params

    const requestCount = 0

    const {
      key: parsedPermissions,
      requestCount: parsePermissionsRequestCount,
    } = this.parsePermissions({ rawKey })

    this.details = {
      meta: rawKey,
      accountId: undefined, //  binance doesn't give this
      permissions: parsedPermissions,
    }

    const totalRequestCount = requestCount + parsePermissionsRequestCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

}
