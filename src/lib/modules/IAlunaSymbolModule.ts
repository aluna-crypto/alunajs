import { IAlunaModule } from '../abstracts/IAlunaModule'
import { IAlunaSymbolSchema } from '../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule extends IAlunaModule {

  list (): Promise<IAlunaSymbolSchema[]>
  listRaw (): Promise<any[]>

  get? (params: { id: string | number }): Promise<IAlunaSymbolSchema>
  getRaw? (params: { id: string | number }): Promise<any>

  parse (params: { rawSymbol: any }): IAlunaSymbolSchema
  parseMany (params: { rawSymbols: any[] }): IAlunaSymbolSchema[]

}
