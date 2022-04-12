import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
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
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import { IPoloniexBalanceSchema } from '../schemas/IPoloniexBalanceSchema'
import { IPoloniexKeySchema } from '../schemas/IPoloniexKeySchema'



export class PoloniexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IPoloniexKeySchema,
  }): IAlunaKeyParsePermissionsReturns {

    const { rawKey } = params

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
    }

    Object.assign(alunaPermissions, rawKey)

    return {
      key: alunaPermissions,
      requestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    PoloniexLog.info('fetching Poloniex key permissions')

    const { keySecret } = this.exchange

    const permissions: IPoloniexKeySchema = {
      read: false,
    }

    let requestCount = 0

    try {

      const timestamp = new Date().getTime()
      const body = new URLSearchParams()

      body.append('command', 'returnOpenOrders')
      body.append('currencyPair', 'all')
      body.append('nonce', timestamp.toString())

      const {
        requestCount: privateRequestCount,
      } = await PoloniexHttp
        .privateRequest<IPoloniexBalanceSchema>({
          verb: AlunaHttpVerbEnum.POST,
          url: `${PROD_POLONIEX_URL}/tradingApi`,
          keySecret,
          body,
        })

      requestCount += privateRequestCount
      permissions.read = true

    } catch (err) {

      const {
        httpStatusCode,
        metadata,
      } = err

      const error = new AlunaError({
        code: AlunaKeyErrorCodes.INVALID,
        message: 'Invalid API key/secret pair.',
        httpStatusCode,
        metadata,
      })

      PoloniexLog.error(error)

      throw error

    }

    const {
      key: details,
      requestCount: parseDetailsCount,
    } = this.parseDetails({ rawKey: permissions })

    const totalRequestCount = requestCount + parseDetailsCount

    return {
      key: details,
      requestCount: totalRequestCount,
    }

  }

  public parseDetails (params: {
    rawKey: IPoloniexKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    PoloniexLog.info('parsing Poloniex key details')

    const {
      rawKey,
    } = params

    const requestCount = 0

    const {
      key: parsedPermissions,
      requestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    this.details = {
      meta: rawKey,
      accountId: undefined, // Poloniex doesn't give accountId
      permissions: parsedPermissions,
    }


    const totalRequestCount = requestCount + parsePermissionsCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

}
