import { Agent } from 'https'



export interface IAlunaSettingsSchema {
  affiliateCode?: string
  orderAnnotation?: string
  proxyAgent?: Agent
  mappings?: Record<string, string>
}
