import { IAlunaSymbolSchema } from '../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbol {

  list (): Promise<IAlunaSymbolSchema[]>
  get? (params: { id: string | number }): Promise<IAlunaSymbolSchema>
  parse (params: { rawSymbol: any }): IAlunaSymbolSchema
  parseMany (params: { rawSymbols: any[] }): IAlunaSymbolSchema[]

}
