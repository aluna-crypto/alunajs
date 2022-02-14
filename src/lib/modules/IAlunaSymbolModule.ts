import { IAlunaSymbolSchema } from '../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule {

  list (): Promise<IAlunaSymbolSchema[]>
  listRaw (): Promise<any[]>

  get? (params: { id: string }): Promise<IAlunaSymbolSchema>
  getRaw? (params: { id: string }): Promise<any>

  parse (params: { rawSymbol: any }): IAlunaSymbolSchema
  parseMany (params: { rawSymbols: any[] }): IAlunaSymbolSchema[]

}
