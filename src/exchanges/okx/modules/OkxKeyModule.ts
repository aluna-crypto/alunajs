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
import { OkxHttp } from '../OkxHttp'
import { OkxLog } from '../OkxLog'
import { PROD_OKX_URL } from '../OkxSpecs'
import { IOkxKeyAccountSchema, IOkxKeySchema } from '../schemas/IOkxKeySchema'



export class OkxKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IOkxKeySchema,
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
      requestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    OkxLog.info('fetching Okx key permissions')

    const INVALID_PERMISSION_CODE = '50030'
    const INVALID_PARAM_CODE = '51116'

    const { keySecret } = this.exchange

    let requestCount = 0

    const permissions: IOkxKeySchema = {
      read: false,
      trade: false,
      withdraw: false,
      accountId: undefined,
      margin: false,
    }

    try {

      const {
        requestCount: privateRequestCount,
        data: [accountConfiguration],
      } = await OkxHttp
        .privateRequest<IOkxKeyAccountSchema[]>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_OKX_URL}/account/config`,
          keySecret,
        })

      permissions.read = true
      permissions.accountId = accountConfiguration.uid
      permissions.margin = Number(accountConfiguration.level) > 1
      requestCount += privateRequestCount

    } catch (error) {

      if (error.metadata?.code === INVALID_PERMISSION_CODE) {

        permissions.read = false

      } else {

        throw error

      }

    }

    const requestBody = {
      instId: 'BTC-USDT',
      tdMode: 'cash',
      side: 'buy',
      ordType: 'limit',
      sz: '1',
      px: '123123123123123',
    }

    const {
      data: [order],
      requestCount: apiRequestCount,
    } = await OkxHttp
      .privateRequest<{ sCode: string }[]>({
        verb: AlunaHttpVerbEnum.POST,
        url: `${PROD_OKX_URL}/trade/order`,
        keySecret,
        body: requestBody,
      })

    requestCount += apiRequestCount

    if (order.sCode === INVALID_PARAM_CODE) {

      permissions.trade = true

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
    rawKey: IOkxKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    OkxLog.info('parsing Okx key details')

    const {
      rawKey,
    } = params

    const {
      accountId,
    } = rawKey

    const requestCount = 0

    const {
      key: parsedPermissions,
      requestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    this.details = {
      meta: rawKey,
      accountId,
      permissions: parsedPermissions,
    }

    const totalRequestCount = parsePermissionsCount + requestCount

    return {
      key: this.details,
      requestCount: totalRequestCount,
    }

  }

}
