import { IAlunaSymbolModule } from '../../../lib/modules/IAlunaSymbolModule'
import { IAlunaSymbolSchema } from '../../../lib/schemas/IAlunaSymbolSchema'
import { GateIOHttp } from '../GateIOHttp'
import { GateIOLog } from '../GateIOLog'
import { IGateIOSymbolSchema } from '../schemas/IGateIOSymbolSchema'



export const GateIOSymbolModule: IAlunaSymbolModule = class {

  public static async list (): Promise<IAlunaSymbolSchema[]> {

    return GateIOSymbolModule.parseMany({
      rawSymbols: await GateIOSymbolModule.listRaw(),
    })

  }



  public static listRaw (): Promise<IGateIOSymbolSchema[]> {

    GateIOLog.info('fetching GateIO symbols')

    return GateIOHttp.publicRequest<IGateIOSymbolSchema[]>({
      url: 'https://api.GateIO.ws/api/v4/spot/currencies',
    })

  }



  public static parse (params:{
    rawSymbol: IGateIOSymbolSchema,
  }): IAlunaSymbolSchema {

    const {
      rawSymbol: {
        currency,
      },
    } = params

    return {
      id: currency,
    }

  }



  public static parseMany (params: {
    rawSymbols: IGateIOSymbolSchema[],
  }): IAlunaSymbolSchema[] {

    const {
      rawSymbols,
    } = params


    const parsedSymbols = rawSymbols
      .map((rawSymbol) => GateIOSymbolModule.parse({
        rawSymbol,
      }))

    GateIOLog.info(`parsed ${parsedSymbols.length} symbols for Gate.io`)

    return parsedSymbols

  }

}
