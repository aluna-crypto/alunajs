import { parse } from 'dotenv'
import { readFileSync } from 'fs'
import { each } from 'lodash'
import { homedir } from 'os'
import { join } from 'path'

import { AlunaAccountEnum } from '../../src/lib/enums/AlunaAccountEnum'



export interface IE2EExchange {
  key?: string
  secret?: string
  passphrase?: string
  symbolPair: string
  delayBetweenTests: number
  orderRate: number
  orderLimitRate?: number
  orderStopRate?: number
  orderAmount: number
  orderEditAmount: number
  orderInsufficientAmount: number
  orderAccount?: AlunaAccountEnum
  supportsGetCanceledOrders?: boolean
}

export interface IE2ELiveData {
  positionId?: string
  limitOrderId?: string
  marketOrderId?: string
  stopLimitOrderId?: string
  stopMarketOrderId?: string
  orderSymbolPair?: string
  positionSymbolPair?: string
  orderEditedAmount?: number
}

export interface IE2EConfig {
  liveData: IE2ELiveData
  exchanges: {
    [key: string]: IE2EExchange
  }
}



export function getEnv() {

  const alunaRcPath = join(homedir(), '.alunarc')
  const alunaRcContents = readFileSync(alunaRcPath, 'utf8')
  const variables = parse(alunaRcContents)

  const output: { [key: string]: string } = {}

  each(variables, (value, key) => {
    if (value !== '') {
      output[key] = value
    }
  })

  return output

}



export function getConfig() {

  const env = getEnv()

  const config: IE2EConfig = {
    liveData: {
      positionId: undefined,
      limitOrderId: undefined,
      marketOrderId: undefined,
      stopLimitOrderId: undefined,
      stopMarketOrderId: undefined,
      orderSymbolPair: undefined,
      positionSymbolPair: undefined,
    },
    exchanges: {
      bitfinex: {
        key: env.BITFINEX_API_KEY,
        secret: env.BITFINEX_API_SECRET,
        passphrase: env.BITFINEX_API_PASSPHRASE,
        symbolPair: 'tBTCUSD',
        delayBetweenTests: 1000,
        orderRate: 1000,
        orderStopRate: 100000,
        orderLimitRate: 1000,
        orderAmount: 0.001,
        orderEditAmount: 0.0011,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.MARGIN,
      },
      bitmex: {
        key: env.BITMEX_API_KEY,
        secret: env.BITMEX_API_SECRET,
        passphrase: env.BITMEX_API_PASSPHRASE,
        symbolPair: 'XBTUSD',
        delayBetweenTests: 200,
        orderRate: 1000,
        orderStopRate: 150000,
        orderLimitRate: 1000,
        orderAmount: 100,
        orderEditAmount: 200,
        orderInsufficientAmount: 2000000,
        orderAccount: AlunaAccountEnum.DERIVATIVES,
      },
      bittrex: {
        key: env.BITTREX_API_KEY,
        secret: env.BITTREX_API_SECRET,
        passphrase: env.BITTREX_API_PASSPHRASE,
        symbolPair: 'BTC-USD',
        delayBetweenTests: 200,
        orderRate: 1000,
        orderAmount: 0.001,
        orderEditAmount: 0.0011,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.SPOT,
      },
      poloniex: {
        key: env.POLONIEX_API_KEY,
        secret: env.POLONIEX_API_SECRET,
        passphrase: env.POLONIEX_API_PASSPHRASE,
        symbolPair: 'USDC_BTC',
        delayBetweenTests: 500,
        orderRate: 10000,
        orderAmount: 0.001,
        orderEditAmount: 0.0012,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.SPOT,
        supportsGetCanceledOrders: false,
      },
      binance: {
        key: env.BINANCE_API_KEY,
        secret: env.BINANCE_API_SECRET,
        passphrase: env.BINANCE_API_PASSPHRASE,
        symbolPair: 'BTCBUSD',
        delayBetweenTests: 200,
        orderRate: 10000,
        orderAmount: 0.001,
        orderEditAmount: 0.0011,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.SPOT,
      },
      gate: {
        key: env.GATE_API_KEY,
        secret: env.GATE_API_SECRET,
        passphrase: env.GATE_API_PASSPHRASE,
        symbolPair: 'BTC_USD',
        delayBetweenTests: 200,
        orderRate: 1000,
        orderAmount: 0.001,
        orderEditAmount: 0.0011,
        orderInsufficientAmount: 100,
        orderAccount: AlunaAccountEnum.SPOT,
      },
      valr: {
        key: env.VALR_API_KEY,
        secret: env.VALR_API_SECRET,
        passphrase: env.VALR_API_PASSPHRASE,
        symbolPair: 'BTCUSDC',
        delayBetweenTests: 500,
        orderRate: 1000,
        orderAmount: 0.001,
        orderEditAmount: 0.0011,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.SPOT,
      },
      okx: {
        key: env.OKX_API_KEY,
        secret: env.OKX_API_SECRET,
        passphrase: env.OKX_API_PASSPHRASE,
        symbolPair: 'BTCUSDC',
        delayBetweenTests: 500,
        orderRate: 1000,
        orderAmount: 0.001,
        orderEditAmount: 0.0011,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.SPOT,
      },
      ftx: {
        key: env.FTX_API_KEY,
        secret: env.FTX_API_SECRET,
        passphrase: env.FTX_API_PASSPHRASE,
        symbolPair: 'BTC/USD',
        delayBetweenTests: 500,
        orderRate: 1000,
        orderAmount: 0.001,
        orderEditAmount: 0.0011,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.SPOT,
      },
    },
  }

  return { config }

}
