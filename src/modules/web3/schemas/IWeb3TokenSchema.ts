import { IDebankTokenSchema } from './IDebankTokenSchema'



export interface IWeb3TokenSchema {
  id: string
  chain: string
  name: string
  symbol: string
  amount: number
  displaySymbol?: string
  meta: IDebankTokenSchema
}
