import { IWeb3ChainSchema } from './IWeb3ChainSchema'
import { IWeb3TokenSchema } from './IWeb3TokenSchema'



export interface IWeb3BalanceSchema {
  chain: Omit<IWeb3ChainSchema, 'meta'>
  tokens: IWeb3TokenSchema[]
}
