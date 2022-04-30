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
  marketId: string
  delayBetweenTests: number
  orderRate: number
  orderLimitRate?: number
  orderStopRate?: number
  orderAmount: number
  orderInsufficientAmount: number
  orderAccount?: AlunaAccountEnum
}

export interface IE2EConfig {
  live: {
    positionId?: string
    limitOrderId?: string
    marketOrderId?: string
    stopLimitOrderId?: string
    stopMarketOrderId?: string
  }
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

  const liveData = {
    limitOrderId: undefined,
    marketOrderId: undefined,
    positionId: undefined,
    orderSymbolPair: undefined,
    positionSymbolPair: undefined,
  }

  const env = getEnv()

  const config: IE2EConfig = {
    live: {
      limitOrderId: undefined,
      marketOrderId: undefined,
      positionId: undefined,
    },
    exchanges: {
      bitfinex: {
        key: env.BITFINEX_API_KEY,
        secret: env.BITFINEX_API_SECRET,
        passphrase: env.BITFINEX_API_PASSPHRASE,
        marketId: 'bitfinex/BTC/USD',
        delayBetweenTests: 1000,
        orderRate: 1000,
        orderStopRate: 150000,
        orderLimitRate: 1000,
        orderAmount: 0.0003,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.MARGIN,
      },
      bitmex: {
        key: env.BITMEX_API_KEY,
        secret: env.BITMEX_API_SECRET,
        passphrase: env.BITMEX_API_PASSPHRASE,
        marketId: 'bitmex/BTC/USD:XBTUSD',
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
        marketId: 'bittrex/ETH/BTC',
        delayBetweenTests: 200,
        orderRate: 0.005,
        orderAmount: 0.05,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
      poloniex: {
        key: env.POLONIEX_API_KEY,
        secret: env.POLONIEX_API_SECRET,
        passphrase: env.POLONIEX_API_PASSPHRASE,
        marketId: 'poloniex/ETH/BTC',
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
        marketId: 'binance/ETH/BTC',
        delayBetweenTests: 200,
        orderRate: 0.02,
        orderAmount: 0.05,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
      gateio: {
        key: env.GATEIO_API_KEY,
        secret: env.GATEIO_API_SECRET,
        passphrase: env.GATEIO_API_PASSPHRASE,
        marketId: 'gateio/ETH/BTC',
        delayBetweenTests: 200,
        orderRate: 0.005,
        orderAmount: 0.05,
        orderInsufficientAmount: 1000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
      valr: {
        key: env.VALR_API_KEY,
        secret: env.VALR_API_SECRET,
        passphrase: env.VALR_API_PASSPHRASE,
        marketId: 'valr/BTC/ZAR',
        delayBetweenTests: 500,
        orderRate: 100,
        orderAmount: 0.1,
        orderInsufficientAmount: 2000,
        orderAccount: AlunaAccountEnum.EXCHANGE,
      },
    },
  }

  return {
    liveData,
    config,
  }

}
