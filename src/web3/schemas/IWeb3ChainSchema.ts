import { Web3ChainsEnum } from '../enums/Web3ChainsEnum'



export interface IWeb3ChainSchema {
  id: string | Web3ChainsEnum
  communityId: string | number
  name: string
  nativeTokenId: string
  logoUrl: string
  wrappedTokenId: string
  usdValue: number
}
