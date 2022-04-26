import { IAlunaExchangeAuthed } from '../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaPositionModule } from '../../lib/modules/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { Bittrex } from './Bittrex'



export class BittrexAuthed extends Bittrex implements IAlunaExchangeAuthed {

  public credentials: IAlunaCredentialsSchema

  public key: IAlunaKeyModule
  public order: IAlunaOrderWriteModule
  public balance: IAlunaBalanceModule
  public position?: IAlunaPositionModule



  constructor (params: {
    settings: IAlunaSettingsSchema,
    credentials: IAlunaCredentialsSchema,
  }) {

    const {
      settings,
      credentials,
    } = params

    super({ settings })

    this.credentials = credentials

    // this.key = key({ exchange: this })
    // this.order = order
    // this.balance = balance
    // this.position = position

    return this

  }

}
