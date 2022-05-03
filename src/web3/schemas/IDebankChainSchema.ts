import { Web3DebankChainsEnum } from '../enums/Web3DebankChainsEnum'



export interface IDebankChainSchema {

  /* eslint-disable camelcase */
  id: Web3DebankChainsEnum
  community_id: string
  name: string
  native_token_id: string
  logo_url: string
  wrapped_token_id: string
  usd_value: number
  /* eslint-enable camelcase */

}
