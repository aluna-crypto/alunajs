import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
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
  }): IAlunaKeyPermissionSchema {

    const { rawKey } = params

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    Object.assign(alunaPermissions, rawKey)

    return alunaPermissions

  }

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    PoloniexLog.info('fetching Poloniex key permissions')

    const { keySecret } = this.exchange

    const permissions: IPoloniexKeySchema = {
      read: true,
      trade: false,
      withdraw: false,
    }

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

      } else if (error.httpStatusCode === 422) {

        permissions.trade = true

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
