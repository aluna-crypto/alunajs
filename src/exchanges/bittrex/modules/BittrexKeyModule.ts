import { IAlunaKeyPermissionSchema } from '../../../index'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import { IAlunaKeySchema } from '../../../lib/schemas/IAlunaKeySchema'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { BittrexOrderTimeInForceEnum } from '../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../enums/BittrexOrderTypeEnum'
import { BittrexSideEnum } from '../enums/BittrexSideEnum'
import { IBittrexBalanceSchema } from '../schemas/IBittrexBalanceSchema'
import { IBittrexKeySchema } from '../schemas/IBittrexKeySchema'



export class BittrexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public parsePermissions (params: {
    rawKey: IBittrexKeySchema,
  }): IAlunaKeyPermissionSchema {

    const { rawKey } = params

    const alunaPermissions: IAlunaKeyPermissionSchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    delete rawKey.accountId

    Object.assign(alunaPermissions, rawKey)

    return alunaPermissions

  }

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    BittrexLog.info('fetching Bittrex key permissions')

    const INVALID_PERMISSION_MESSAGE = 'INVALID_PERMISSION'
    const BAD_REQUEST_MESSAGE = 'BAD_REQUEST'

    const { keySecret } = this.exchange

    const permissions: IBittrexKeySchema = {
      read: false,
      trade: false,
      withdraw: false,
    }

    try {

      await BittrexHttp
        .privateRequest<IBittrexBalanceSchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_BITTREX_URL}/balances`,
          keySecret,
        })

      permissions.read = true

    } catch (error) {

      if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

        permissions.read = false

      } else {

        throw error

      }

    }

    try {

      const requestBody = {
        marketSymbol: 'BTCEUR',
        direction: BittrexSideEnum.BUY,
        type: BittrexOrderTypeEnum.MARKET,
        quantity: 0,
        timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
        useAwards: false,
      }

      await BittrexHttp
        .privateRequest<IBittrexBalanceSchema>({
          verb: AlunaHttpVerbEnum.POST,
          url: `${PROD_BITTREX_URL}/orders`,
          keySecret,
          body: requestBody,
        })

    } catch (error) {

      if (error.metadata?.code === INVALID_PERMISSION_MESSAGE) {

        permissions.trade = false

      } else if (error.metadata?.code === BAD_REQUEST_MESSAGE) {

        permissions.trade = true

      } else {

        throw error

      }

    }

    try {

      const account = await BittrexHttp
        .privateRequest<IBittrexKeySchema>({
          verb: AlunaHttpVerbEnum.GET,
          url: `${PROD_BITTREX_URL}/account`,
          keySecret,
        })

      permissions.accountId = account.accountId

    } catch (error) {

      BittrexLog.error(error)

      throw error

    }

    const details = this.parseDetails({ rawKey: permissions })

    return details

  }

  public parseDetails (params: {
    rawKey: IBittrexKeySchema,
  }): IAlunaKeySchema {

    BittrexLog.info('parsing Bittrex key details')

    const {
      rawKey,
    } = params

    const {
      accountId,
    } = rawKey

    this.details = {
      meta: rawKey,
      accountId,
      permissions: this.parsePermissions({ rawKey }),
    }

    return this.details

  }

}
