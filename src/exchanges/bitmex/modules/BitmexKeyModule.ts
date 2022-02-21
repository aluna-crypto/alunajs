import { filter } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaKeyErrorCodes } from '../../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaKeyModule } from '../../../lib/modules/IAlunaKeyModule'
import {
  IAlunaKeyPermissionSchema,
  IAlunaKeySchema,
} from '../../../lib/schemas/IAlunaKeySchema'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { BitmexSpecs } from '../BitmexSpecs'
import { IBitmexKeysSchema } from '../schemas/IBitmexKeysSchema'



export class BitmexKeyModule extends AAlunaModule implements IAlunaKeyModule {

  public details: IAlunaKeySchema

  public async fetchDetails (): Promise<IAlunaKeySchema> {

    BitmexLog.info('fetching Bitmex key details')

    const { keySecret } = this.exchange

    let rawKey: IBitmexKeysSchema

    try {

      rawKey = await BitmexHttp.privateRequest<IBitmexKeysSchema>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${BitmexSpecs.connectApiUrl}/apiKey`,
        keySecret,
      })

    } catch (error) {

      const { message } = error

      let code: string
      let httpStatusCode: number
      let metadata: undefined

      if (message === 'Invalid API Key.') {

        code = AlunaKeyErrorCodes.INVALID
        httpStatusCode = 401

      } else {

        code = AlunaHttpErrorCodes.REQUEST_ERROR
        httpStatusCode = 500
        metadata = error.metadata

      }

      const alunaError = new AlunaError({
        code,
        message,
        httpStatusCode,
        metadata,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    const details = this.parseDetails({ rawKey })

    return details

  }

  public parseDetails (params: {
    rawKey: IBitmexKeysSchema,
  }): IAlunaKeySchema {

    BitmexLog.info('parsing Bitmex key details')

    const {
      rawKey,
    } = params

    const [{ userId }] = rawKey

    this.details = {
      accountId: userId.toString(),
      permissions: this.parsePermissions({ rawKey }),
      meta: rawKey,
    }

    return this.details

  }

  public parsePermissions (params: {
    rawKey: IBitmexKeysSchema,
  }): IAlunaKeyPermissionSchema {

    BitmexLog.info('parsing Bitmex key permissions')

    const { rawKey } = params

    const { key } = this.exchange.keySecret

    const [singleRawKey] = filter(rawKey, ((k) => k.id === key))

    const parsedKey: IAlunaKeyPermissionSchema = {
      read: true,
    }

    const { permissions } = singleRawKey

    if (permissions.length) {

      parsedKey.trade = permissions.includes('order')
      parsedKey.withdraw = permissions.includes('withdraw')

    }

    return parsedKey

  }

}
