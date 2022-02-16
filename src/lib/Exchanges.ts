import { Binance } from '../exchanges/binance/Binance'
import { Bitfinex } from '../exchanges/bitfinex/Bitfinex'
import { Gateio } from '../exchanges/gateio/Gateio'
import { Valr } from '../exchanges/valr/Valr'



export class Exchanges {

  public static readonly Gateio = Gateio
  public static readonly Binance = Binance
  public static readonly Bitfinex = Bitfinex
  public static readonly Valr = Valr

}
