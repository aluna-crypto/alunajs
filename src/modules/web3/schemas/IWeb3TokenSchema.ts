import { IDebankTokenSchema } from './IDebankTokenSchema'



export interface IWeb3TokenSchema {
  id: string
  chain: string
  name: string
  symbol: string
  displaySymbol?: string
  meta: IDebankTokenSchema
}
