import { AlunaError } from '../../lib/core/AlunaError'
import { IAlunaExchangeAuthed } from '../../lib/core/IAlunaExchange'
import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaBalanceModule } from '../../lib/modules/authed/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaPositionModule } from '../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { balance } from './modules/authed/balance'
import { key } from './modules/authed/key'
import { order } from './modules/authed/order'
import { position } from './modules/authed/position'
import { Okx } from './Okx'



export class OkxAuthed extends Okx implements IAlunaExchangeAuthed {

  public credentials: IAlunaCredentialsSchema

  public key: IAlunaKeyModule
  public order: IAlunaOrderWriteModule
  public balance: IAlunaBalanceModule
  public position: IAlunaPositionModule



  constructor(params: {
    settings?: IAlunaSettingsSchema
    credentials: IAlunaCredentialsSchema
  }) {

    const {
      settings,
      credentials,
    } = params

    if (!credentials.passphrase) {

      throw new AlunaError({
        code: AlunaKeyErrorCodes.MISSING_PASSPHRASE,
        message: "'passphrase' is required for private requests on Okx",
        httpStatusCode: 200,
      })

    }

    super({ settings })

    this.credentials = credentials

    this.key = key(this)
    this.balance = balance(this)
    this.order = order(this)
    this.position = position(this)

    return this

  }

}
