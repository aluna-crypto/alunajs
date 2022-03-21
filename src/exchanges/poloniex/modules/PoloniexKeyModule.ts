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
import { PoloniexOrderTimeInForceEnum } from '../enums/PoloniexOrderTimeInForceEnum'
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
      trade: false,
      withdraw: false,
    }

    Object.assign(alunaPermissions, rawKey)

    return {
      key: alunaPermissions,
      apiRequestCount: 0,
    }

  }

  public async fetchDetails (): Promise<IAlunaKeyFetchDetailsReturns> {

    PoloniexLog.info('fetching Poloniex key permissions')

    const { keySecret } = this.exchange

    const permissions: IPoloniexKeySchema = {
      read: true,
      trade: false,
      withdraw: false,
    }

    let apiRequestCount = 0

    try {

      const timestamp = new Date().getTime()
      const body = new URLSearchParams()

      body.append('command', 'sell')
      body.append('currencyPair', 'BUSDBNB')
      body.append('amount', '1')
      body.append('rate', '9999999')
      body.append(PoloniexOrderTimeInForceEnum.POST_ONLY, '1')
      body.append('nonce', timestamp.toString())

      await PoloniexHttp
        .privateRequest<IPoloniexBalanceSchema>({
          verb: AlunaHttpVerbEnum.POST,
          url: `${PROD_POLONIEX_URL}/tradingApi`,
          keySecret,
          body,
        })

    } catch (error) {

      if (error.httpStatusCode === 403) {

        permissions.trade = false
        apiRequestCount += 1

      } else if (error.httpStatusCode === 422) {

        permissions.trade = true
        apiRequestCount += 1

      } else {

        throw error

      }

    }

    const {
      key: details,
      apiRequestCount: parseDetailsCount,
    } = this.parseDetails({ rawKey: permissions })

    const totalApiRequestCount = apiRequestCount + parseDetailsCount

    return {
      key: details,
      apiRequestCount: totalApiRequestCount,
    }

  }

  public parseDetails (params: {
    rawKey: IPoloniexKeySchema,
  }): IAlunaKeyParseDetailsReturns {

    PoloniexLog.info('parsing Poloniex key details')

    const {
      rawKey,
    } = params

    let apiRequestCount = 0

    const {
      key: parsedPermissions,
      apiRequestCount: parsePermissionsCount,
    } = this.parsePermissions({ rawKey })

    apiRequestCount += 1

    this.details = {
      meta: rawKey,
      accountId: undefined, // Poloniex doesn't give accountId
      permissions: parsedPermissions,
    }


    const totalApiRequestCount = apiRequestCount + parsePermissionsCount

    return {
      key: this.details,
      apiRequestCount: totalApiRequestCount,
    }

  }

}
