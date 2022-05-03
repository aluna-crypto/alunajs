import { Web3DebankChainsEnum } from '../enums/Web3DebankChainsEnum'



export interface IWeb3ChainSchema {

  id: Web3DebankChainsEnum
  communityId: string
  name: string
  nativeTokenId: string
  logoUrl: string
  wrappedTokenId: string
  usdValue: number

}
