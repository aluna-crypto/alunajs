import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
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
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import {
  IBitfinexKeySchema,
  IBitfinexPermissionsScope,
} from '../schemas/IBitfinexKeySchema'



export class BitfinexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    BitfinexLog.info('fetching Bitfinex key details')

    const { keySecret } = this.exchange

    const { privateRequest } = BitfinexHttp

    let userInfoResponse: string[]
    let permissionsScope: IBitfinexPermissionsScope
    let requestCount = 0

    try {

      const {
        data: permissions,
        requestCount: permissionsCount,
      } = await privateRequest<IBitfinexPermissionsScope>({
        url: 'https://api.bitfinex.com/v2/auth/r/permissions',
        keySecret,
      })

      permissionsScope = permissions
      requestCount += permissionsCount

      const {
        data: userInfo,
        requestCount: userInfoCount,
      } = await privateRequest<string[]>({
        url: 'https://api.bitfinex.com/v2/auth/r/info/user',
        keySecret,
      })

      userInfoResponse = userInfo
      requestCount += userInfoCount

    } catch (error) {

      const { message, metadata } = error
      let { code, httpStatusCode } = error

      if (['apikey: invalid', 'apikey: digest invalid'].includes(message)) {

        code = AlunaKeyErrorCodes.INVALID
        httpStatusCode = 200

      }

      throw new AlunaError({
        code,
        message: error.message,
        httpStatusCode,
        metadata,
      })

    }


    const [accountId] = userInfoResponse

    const {
      key: details,
      requestCount: parseDetailsCount,
    } = this.parseDetails({
      rawKey: {
        accountId,
        permissionsScope,
      },
    })

    const totalRequestCount = requestCount + parseDetailsCount

    return {
      key: details,
      requestCount: totalRequestCount,
    }

  }

  public parseDetails (params: {
    rawKey: IBitfinexKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    BitfinexLog.info('parsing Bitfinex key details')

    const {
      rawKey,
    } = params

    const { accountId } = rawKey

    const requestCount = 0

    const {
      key: parsedPermissions,
      requestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    this.details = {
      accountId,
      permissions: parsedPermissions,
      meta: rawKey,
    }

    const totalRequestCount = requestCount + parsePermissionsCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

  public parsePermissions (params: {
    rawKey: IBitfinexKeySchema,
  }): IAlunaKeyParsePermissionsReturns {

    BitfinexLog.info('parsing Bitfinex key permissions')

    const { rawKey } = params

    const { permissionsScope } = rawKey

    const [
      _accountScope,
      ordersScope,
      _fundingScope,
      _settingsScope,
      walletsScope,
      withdrawScope,
    ] = permissionsScope

    const canReadBalances = walletsScope[1] === 1

    const canReadOrders = ordersScope[1] === 1
    const canCreateOrders = ordersScope[2] === 1

    const canWithdraw = withdrawScope[2] === 1

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: canReadBalances && canReadOrders,
      trade: canCreateOrders,
      withdraw: canWithdraw,
    }

    return {
      key: alunaPermissions,
      requestCount: 0,
    }

  }

}
