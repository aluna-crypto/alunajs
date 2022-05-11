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
  orderInsufficientAmount: number
  orderAccount?: AlunaAccountEnum
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
        orderStopRate: 150000,
        orderLimitRate: 1000,
        orderAmount: 0.0001,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.MARGIN,
      },
      bitmex: {
        key: env.BITMEX_API_KEY,
        secret: env.BITMEX_API_SECRET,
        passphrase: env.BITMEX_API_PASSPHRASE,
        symbolPair: 'bitmex/BTC/USD:XBTUSD',
        delayBetweenTests: 200,
        orderRate: 1000,
        orderStopRate: 150000,
        orderLimitRate: 1000,
        orderAmount: 100,
        orderInsufficientAmount: 2000000,
        orderAccount: AlunaAccountEnum.DERIVATIVES,
      },
      bittrex: {
        key: env.BITTREX_API_KEY,
        secret: env.BITTREX_API_SECRET,
        passphrase: env.BITTREX_API_PASSPHRASE,
        symbolPair: 'ADA-USD',
        delayBetweenTests: 200,
        orderRate: 0.04,
        orderAmount: 3,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
      poloniex: {
        key: env.POLONIEX_API_KEY,
        secret: env.POLONIEX_API_SECRET,
        passphrase: env.POLONIEX_API_PASSPHRASE,
        symbolPair: 'poloniex/ETH/BTC',
        delayBetweenTests: 500,
        orderRate: 0.002,
        orderAmount: 0.05,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
      binance: {
        key: env.BINANCE_API_KEY,
        secret: env.BINANCE_API_SECRET,
        passphrase: env.BINANCE_API_PASSPHRASE,
        symbolPair: 'binance/ETH/BTC',
        delayBetweenTests: 200,
        orderRate: 0.02,
        orderAmount: 0.05,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
      gate: {
        key: env.GATE_API_KEY,
        secret: env.GATE_API_SECRET,
        passphrase: env.GATE_API_PASSPHRASE,
        symbolPair: 'DOGE_USDT',
        delayBetweenTests: 200,
        orderRate: 0.03,
        orderAmount: 35,
        orderInsufficientAmount: 5000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
      valr: {
        key: env.VALR_API_KEY,
        secret: env.VALR_API_SECRET,
        passphrase: env.VALR_API_PASSPHRASE,
        symbolPair: 'BTCZAR',
        delayBetweenTests: 500,
        orderRate: 100000,
        orderAmount: 0.0001,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
    },
  }

  return { config }

}
