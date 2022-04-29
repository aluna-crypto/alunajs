import {
  IAlunaExchangeAuthed,
  IAlunaExchangePublic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaMarketModule } from '../../lib/modules/public/IAlunaMarketModule'
import { IAlunaSymbolModule } from '../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaExchangeSchema } from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { buildBittrexSpecs } from './bittrexSpecs'
import { market } from './modules/public/market'
import { symbol } from './modules/public/symbol'



export class Bittrex implements IAlunaExchangePublic {

  public id: string
  public specs: IAlunaExchangeSchema
  public settings: IAlunaSettingsSchema

  public symbol: IAlunaSymbolModule
  public market: IAlunaMarketModule



  constructor(params: {
    settings: IAlunaSettingsSchema
  }) {

    const { settings } = params

    this.settings = settings
    this.specs = buildBittrexSpecs({ settings })
    this.id = this.specs.id

    this.market = market(this)
    this.symbol = symbol(this)

  }



  public async auth(
    credentials: IAlunaCredentialsSchema,
  ): Promise<IAlunaExchangeAuthed> {

    const { BittrexAuthed } = await import('./BittrexAuthed')

    return new BittrexAuthed({
      settings: this.settings,
      credentials,
    })

  }

}
