import {
  IAlunaExchangeAuthed,
  IAlunaExchangePublic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaMarketModule } from '../../lib/modules/public/IAlunaMarketModule'
import { IAlunaSymbolModule } from '../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaExchangeSchema } from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { market } from './modules/public/market'
import { symbol } from './modules/public/symbol'
import { buildSampleSpecs } from './sampleSpecs'



export class Sample implements IAlunaExchangePublic {

  public id: string
  public specs: IAlunaExchangeSchema
  public settings: IAlunaSettingsSchema

  public symbol: IAlunaSymbolModule
  public market: IAlunaMarketModule



  constructor (params: {
    settings: IAlunaSettingsSchema,
  }) {

    const { settings } = params

    this.settings = settings
    this.specs = buildSampleSpecs({ settings })
    this.id = this.specs.id

    this.market = market
    this.symbol = symbol

  }



  public async auth (
    credentials: IAlunaCredentialsSchema,
  ): Promise<IAlunaExchangeAuthed> {

    const { SampleAuthed } = await import('./SampleAuthed')

    return new SampleAuthed({
      settings: this.settings,
      credentials,
    })

  }

}
