import { IAlunaHttp } from '../../../lib/core/IAlunaHttp'
import { IAlunaCredentialsSchema } from '../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../../lib/schemas/IAlunaSettingsSchema'
import { HuobiAccountTypeEnum } from '../enums/HuobiAccountTypeEnum'



export interface IHuobiGetAccountIdHelperParams {
  http: IAlunaHttp
  credentials: IAlunaCredentialsSchema
  settings: IAlunaSettingsSchema
}

export interface IHuobiUserAccountSchema {
  id: number
  type: HuobiAccountTypeEnum
  subtype: string
  state: string
}

export interface IHuobiGetAccountIdHelperReturns {
  accountId: number
}
