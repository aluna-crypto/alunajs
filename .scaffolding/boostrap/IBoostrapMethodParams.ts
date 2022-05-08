import { IScaffoldSettings } from '../bootstrapExchange'



export interface IBoostrapMethodParams {
  log: any // function
  settings: IScaffoldSettings
  files: string[]
  paths: {
    ROOT: string
    SRC: string
    EXCHANGES: string
    SAMPLE_EXCHANGE: string
    DESTINATION: string
  }
  configs: {
    exchangeName: string
    exchangeUpper: string
    exchangeLower: string
  }
}
