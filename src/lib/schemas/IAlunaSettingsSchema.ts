import { Agent as HttpAgent } from 'http'
import { Agent as HttpsAgent } from 'https'

import { AlunaProtocolsEnum } from '../enums/AlunaProxyAgentEnum'



export interface IAlunaSettingsSchema {
  cacheTTL?: number // default 60
  disableCache?: boolean // default false
  affiliateCode?: string
  orderAnnotation?: string
  referralCode?: string
  proxySettings?: IAlunaProxySchema
  useTestNet?: boolean
  symbolMappings?: Record<string, string>
}



export interface IAlunaProxySchema {
  host: string
  port: number
  protocol?: AlunaProtocolsEnum
  agent?: HttpAgent | HttpsAgent
}
