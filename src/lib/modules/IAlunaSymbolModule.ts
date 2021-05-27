import {
  IValrSymbolSchema,
} from 'src/exchanges/valr/lib/schemas/IValrSymbolSchema'

import { IAlunaModule } from '@lib/abstracts/IAlunaModule'

import { IAlunaSymbolSchema } from '../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule extends IAlunaModule {

  list (): Promise<IAlunaSymbolSchema[]>
  listRaw (): Promise<IValrSymbolSchema[]>
  get? (params: { id: string | number }): Promise<IAlunaSymbolSchema>
  parse (params: { rawSymbol: any }): IAlunaSymbolSchema
  parseMany (params: { rawSymbols: any[] }): IAlunaSymbolSchema[]

}
