import { Agent as HttpAgent } from 'http'
import { Agent as HttpsAgent } from 'https'



export interface IAlunaSettingsSchema {
  affiliateCode?: string
  orderAnnotation?: string
  proxySettings?: IAlunaProxySchema
  mappings?: Record<string, string>
}



export interface IAlunaProxySchema {
  host: string
  port: number
  protocol: string
  agent?: HttpAgent | HttpsAgent
}
