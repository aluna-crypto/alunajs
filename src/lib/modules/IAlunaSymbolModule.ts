import { IAlunaSymbolSchema } from '../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule {

  list (): Promise<IAlunaSymbolSchema[]>
  listRaw (): Promise<any[]>

  get? (params: { id: string | number }): Promise<IAlunaSymbolSchema>
  getRaw? (params: { id: string | number }): Promise<any>

  parse (params: { rawSymbol: any }): IAlunaSymbolSchema
  parseMany (params: { rawSymbols: any[] }): IAlunaSymbolSchema[]

}
