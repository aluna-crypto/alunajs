import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
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
  }): IAlunaKeyPermissionSchema {

    const { rawKey } = params

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: true,
      withdraw: false,
    }

    Object.assign(alunaPermissions, rawKey)

    return alunaPermissions

  }

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    PoloniexLog.info('fetching Poloniex key permissions')

    const { keySecret } = this.exchange

    const permissions: IPoloniexKeySchema = {
      read: false,
    }

    try {

      const timestamp = new Date().getTime()
      const body = new URLSearchParams()

      body.append('command', 'returnOpenOrders')
      body.append('currencyPair', 'all')
      body.append('nonce', timestamp.toString())

      await PoloniexHttp
        .privateRequest<IPoloniexBalanceSchema>({
          verb: AlunaHttpVerbEnum.POST,
          url: `${PROD_POLONIEX_URL}/tradingApi`,
          keySecret,
          body,
        })

      permissions.read = true

    } catch (error) {

      if (error.httpStatusCode === 403) {

        permissions.read = false

      } else {

        throw error

      }

    }

    const details = this.parseDetails({ rawKey: permissions })

    return details

  }

  public parseDetails (params: {
    rawKey: IPoloniexKeySchema,
  }): IAlunaKeySchema {

    PoloniexLog.info('parsing Poloniex key details')

    const {
      rawKey,
    } = params

    this.details = {
      meta: rawKey,
      accountId: undefined, // Poloniex doesn't give accountId
      permissions: this.parsePermissions({ rawKey }),
    }

    return this.details

  }

}
