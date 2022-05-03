import { Web3DebankChainsEnum } from '../enums/Web3DebankChainsEnum'



export interface IWeb3ChainSchema {

  id: string | Web3DebankChainsEnum
  communityId: string | number
  name: string
  nativeTokenId: string
  logoUrl: string
  wrappedTokenId: string
  usdValue: number

}
