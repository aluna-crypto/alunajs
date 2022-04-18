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
import { getHuobiAccountId } from '../helpers/GetHuobiAccountId'
import { HuobiHttp } from '../HuobiHttp'
import { HuobiLog } from '../HuobiLog'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import { IHuobiKeySchema } from '../schemas/IHuobiKeySchema'



export class HuobiKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions(params: {
    rawKey: IHuobiKeySchema,
  }): IAlunaKeyParsePermissionsReturns {

    const { rawKey } = params

    const { permission: permissions } = rawKey

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    permissions.split(',').forEach((permission: string) => {

      switch (permission) {

        case 'withdraw':
          alunaPermissions.withdraw = true
          break

        case 'readOnly':
          alunaPermissions.read = true
          break

        case 'trade':
          alunaPermissions.trade = true
          break

        default:

          HuobiLog.info(`Unknown permission '${permission}' found on Huobi`
            .concat('permissions API response'))
          break

      }

    })

    return {
      key: alunaPermissions,
      requestCount: 0,
    }

  }

  public async fetchDetails(): Promise<IAlunaKeyFetchDetailsReturns> {

    HuobiLog.info('fetching Huobi key permissionsa')

    let rawKey: IHuobiKeySchema
    let requestCount = 0
    let accountId: string | undefined

    try {

      const { keySecret } = this.exchange

      const {
        data: userUid,
        requestCount: privateRequestCount,
      } = await HuobiHttp
        .privateRequest<number>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_HUOBI_URL}/v2/user/uid`,
          keySecret,
        })

      requestCount += privateRequestCount

      const query = new URLSearchParams()
      query.append('uid', userUid.toString())

      const {
        data: keyInfo,
        requestCount: privateRequestCount2,
      } = await HuobiHttp
        .privateRequest<IHuobiKeySchema[]>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_HUOBI_URL}/v2/user/api-key`,
          keySecret,
          query: query.toString(),
        })

      const [accessKeyInfo] = keyInfo

      rawKey = accessKeyInfo
      requestCount += privateRequestCount2

      const {
        accountId: huobiAccountId,
        requestCount: getHuobiAccountIdCount,
      } = await getHuobiAccountId(keySecret)

      accountId = huobiAccountId.toString()
      requestCount += getHuobiAccountIdCount


    } catch (error) {

      HuobiLog.error(error.message)

      throw error

    }

    const {
      key: details,
      requestCount: parseDetailsRequestCount,
    } = this.parseDetails({ rawKey, accountId })

    const totalRequestCount = requestCount + parseDetailsRequestCount

    return {
      key: details,
      requestCount: totalRequestCount,
    }

  }

  public parseDetails(params: {
    rawKey: IHuobiKeySchema,
    accountId: string,
  }): IAlunaKeyParseDetailsReturns {

    HuobiLog.info('parsing Huobi key details')

    const {
      rawKey,
      accountId,
    } = params

    const requestCount = 0

    const {
      key: parsedPermissions,
      requestCount: parsePermissionsRequestCount,
    } = this.parsePermissions({ rawKey })

    this.details = {
      meta: rawKey,
      accountId,
      permissions: parsedPermissions,
    }

    const totalRequestCount = requestCount + parsePermissionsRequestCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

}
