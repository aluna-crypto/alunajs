import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from '../../index'
import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import { ValrMarketModule } from '../valr/modules/ValrMarketModule'
import { BinanceSpecs } from './BinanceSpecs'
import { BinanceSymbolModule } from './modules/BinanceSymbolModule'



export const PROD_BINANCE_URL = 'https://api.binance.com' // @TODO -> Update url
export const DEV_BINANCE_URL = 'https://testnet.binance.vision' // @TODO -> Update url

export const Binance: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {
    // static definitions
    static readonly ID = BinanceSpecs.id
    static readonly SPECS = BinanceSpecs
  
    static Symbol = BinanceSymbolModule
    static Market = ValrMarketModule // @TODO -> need to update
  
    // local definitions
    key: any // @TODO -> need to update
    order: any // @TODO -> need to update
    balance: any // @TODO -> need to update
}