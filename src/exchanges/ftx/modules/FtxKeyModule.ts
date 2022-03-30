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
      apiRequestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    FtxLog.info('fetching Ftx key permissionsa')

    let rawKey: IFtxKeySchema
    let apiRequestCount = 0

    try {

      const { keySecret } = this.exchange

      const {
        data: { result },
        apiRequestCount: requestCount,
      } = await FtxHttp
        .privateRequest<IFtxResponseSchema<IFtxKeySchema>>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_FTX_URL}/login_status`,
          keySecret,
        })

      rawKey = result
      apiRequestCount += requestCount

    } catch (error) {

      FtxLog.error(error.message)

      throw error

    }

    const {
      key: details,
      apiRequestCount: parseDetailsCount,
    } = this.parseDetails({ rawKey })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + parseDetailsCount

    return {
      key: details,
      apiRequestCount: totalApiRequestCount,
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

    let apiRequestCount = 0

    const {
      key: permissions,
      apiRequestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    apiRequestCount += 1

    this.details = {
      accountId: accountIdentifier.toString(),
      permissions,
      meta: rawKey,
    }

    const totalApiRequestCount = apiRequestCount + parsePermissionsCount

    return {
      key: this.details,
      apiRequestCount: totalApiRequestCount,
    }

  }

}
