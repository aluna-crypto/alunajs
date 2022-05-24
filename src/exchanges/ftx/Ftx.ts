import { IAlunaExchangePublic } from '../../lib/core/IAlunaExchange'
import { IAlunaMarketModule } from '../../lib/modules/public/IAlunaMarketModule'
import { IAlunaSymbolModule } from '../../lib/modules/public/IAlunaSymbolModule'
import { IAlunaExchangeSchema } from '../../lib/schemas/IAlunaExchangeSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { buildFtxSpecs } from './ftxSpecs'
import { market } from './modules/public/market'
import { symbol } from './modules/public/symbol'



export class Ftx implements IAlunaExchangePublic {

  public id: string
  public specs: IAlunaExchangeSchema
  public settings: IAlunaSettingsSchema

  public symbol: IAlunaSymbolModule
  public market: IAlunaMarketModule



  constructor(params: {
    settings?: IAlunaSettingsSchema
  }) {

    const { settings = {} } = params

    this.settings = settings
    this.specs = buildFtxSpecs({ settings })
    this.id = this.specs.id

    this.market = market(this)
    this.symbol = symbol(this)

  }

}
