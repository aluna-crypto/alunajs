import { Binance } from '../exchanges/binance/Binance'
import { Bitfinex } from '../exchanges/bitfinex/Bitfinex'
import { Bitmex } from '../exchanges/bitmex/Bitmex'
import { Bittrex } from '../exchanges/bittrex/Bittrex'
import { Ftx } from '../exchanges/ftx/Ftx'
import { Gateio } from '../exchanges/gateio/Gateio'
import { Valr } from '../exchanges/valr/Valr'



export class Exchanges {

  public static readonly Gateio = Gateio
  public static readonly Binance = Binance
  public static readonly Bitfinex = Bitfinex
  public static readonly Bitmex = Bitmex
  public static readonly Bittrex = Bittrex
  public static readonly Valr = Valr
  public static readonly Ftx = Ftx

}
