import { IAlunaSymbolSchema } from '../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule {

  list (): Promise<IAlunaSymbolSchema[]>
  listRaw (): Promise<any>

  get? (params: { symbolPair: string }): Promise<IAlunaSymbolSchema>
  getRaw? (params: { symbolPair: string }): Promise<any>

  parse (params: { rawSymbol: any }): IAlunaSymbolSchema
  parseMany (params: { rawSymbols: any }): IAlunaSymbolSchema[]

}
