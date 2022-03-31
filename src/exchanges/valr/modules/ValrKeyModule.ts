import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
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
import {
  IValrKeySchema,
  ValrApiKeyPermissions,
} from '../schemas/IValrKeySchema'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export class ValrKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    ValrLog.info('fetching Valr key details')

    const { keySecret } = this.exchange

    let rawKey: IValrKeySchema
    let requestCount = 0

    try {

      const {
        data: rawKeyInfo,
        requestCount: requestApiCount,
      } = await ValrHttp.privateRequest<IValrKeySchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: 'https://api.valr.com/v1/account/api-keys/current',
        keySecret,
      })

      rawKey = rawKeyInfo
      requestCount += requestApiCount

    } catch (error) {

      const { message, metadata } = error

      let code: string
      let httpStatusCode: number

      if (message === 'API key or secret is invalid') {

        code = AlunaKeyErrorCodes.INVALID
        httpStatusCode = 401

      } else {

        code = AlunaHttpErrorCodes.REQUEST_ERROR
        httpStatusCode = 500

      }

      const alunaError = new AlunaError({
        code,
        message,
        httpStatusCode,
        metadata,
      })

      throw alunaError

    }

    const {
      key: details,
      requestCount: parseDetailsRequestCount,
    } = this.parseDetails({ rawKey })

    const totalRequestCount = requestCount
      + parseDetailsRequestCount

    const response: IAlunaKeyFetchDetailsReturns = {
      key: details,
      requestCount: totalRequestCount,
    }

    return response

  }

  public parseDetails (params: {
    rawKey: IValrKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    ValrLog.info('parsing Valr key details')

    const {
      rawKey,
    } = params

    const {
      key: permissions,
      requestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    this.details = {
      meta: rawKey,
      accountId: undefined, //  valr doesn't give this
      permissions,
    }

    const totalRequestCount = parsePermissionsCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

  public parsePermissions (params: {
    rawKey: IValrKeySchema,
  }): IAlunaKeyParsePermissionsReturns {

    ValrLog.info('parsing Valr key permissions')

    const { rawKey } = params

    const { permissions } = rawKey

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    permissions.forEach((permission) => {

      switch (permission) {

        case ValrApiKeyPermissions.VIEW_ACCESS:
          alunaPermissions.read = true
          break

        case ValrApiKeyPermissions.TRADE:
          alunaPermissions.trade = true
          break

        case ValrApiKeyPermissions.WITHDRAW:
          alunaPermissions.withdraw = true
          break

        default:

          ValrLog.info(`Unknown permission '${permission}' found on Valr`
            .concat('permissions API response'))

      }

    })

    const response: IAlunaKeyParsePermissionsReturns = {
      requestCount: 0,
      key: alunaPermissions,
    }

    return response

  }

}
