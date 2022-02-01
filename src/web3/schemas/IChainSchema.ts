import { AlunaChainsEnum } from '../enums/AlunaChainsEnum'

/**
 * "chain_list" schema, when parsing response from
 // eslint-disable-next-line max-len
 * https://docs.open.debank.com/en/reference/api-reference/user#get-user-total-balance
 */
export interface IChainSchema {

  id: AlunaChainsEnum
  community_id: string
  name: string
  native_token_id: string
  logo_url: string
  wrapped_token_id: string
  usd_value: number
}
