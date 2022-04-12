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
import { FtxHttp } from '../FtxHttp'
import { FtxLog } from '../FtxLog'
import { PROD_FTX_URL } from '../FtxSpecs'
import { IFtxKeySchema } from '../schemas/IFtxKeySchema'
import { IFtxResponseSchema } from '../schemas/IFtxSchema'



export class FtxKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IFtxKeySchema,
  }): IAlunaKeyParsePermissionsReturns {

    const { rawKey } = params

    const { readOnly, withdrawalEnabled } = rawKey

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: true,
      trade: false,
      withdraw: false,
    }

    if (!readOnly) {

      alunaPermissions.read = true
      alunaPermissions.trade = true

    }

    if (withdrawalEnabled) {

      alunaPermissions.withdraw = true

    }

    return {
      key: alunaPermissions,
      requestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    FtxLog.info('fetching Ftx key permissionsa')

    let rawKey: IFtxKeySchema
    let requestCount = 0

    try {

      const { keySecret } = this.exchange

      const {
        data: { result },
        requestCount: apiRequestCount,
      } = await FtxHttp
        .privateRequest<IFtxResponseSchema<IFtxKeySchema>>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_FTX_URL}/login_status`,
          keySecret,
        })

      rawKey = result
      requestCount += apiRequestCount

    } catch (error) {

      FtxLog.error(error.message)

      throw error

    }

    const {
      key: details,
      requestCount: parseDetailsCount,
    } = this.parseDetails({ rawKey })

    requestCount += 1

    const totalRequestCount = requestCount + parseDetailsCount

    return {
      key: details,
      requestCount: totalRequestCount,
    }

  }

  public parseDetails (params: {
    rawKey: IFtxKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    FtxLog.info('parsing Ftx key details')

    const {
      rawKey,
    } = params

    const { account } = rawKey

    const { accountIdentifier } = account

    let requestCount = 0

    const {
      key: permissions,
      requestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    requestCount += 1

    this.details = {
      accountId: accountIdentifier.toString(),
      permissions,
      meta: rawKey,
    }

    const totalRequestCount = requestCount + parsePermissionsCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

}
