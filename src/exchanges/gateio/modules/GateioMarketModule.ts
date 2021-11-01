import { IAlunaMarketModule } from '../../../lib/modules/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { GateioLog } from '../GateioLog'
import { IGateioMarketSchema } from '../schemas/IGateioMarketSchema'



export const GateioMarketModule: IAlunaMarketModule = class {

  public static async listRaw (): Promise<IGateioMarketSchema[]> {

    // TODO implement me

    GateioLog.info('fetching Gateio markets')

    throw new Error('not implemented')

  }

  public static async list (): Promise<IAlunaMarketSchema[]> {

    // TODO implement me

    throw new Error('not implemented')

  }

  public static parse (params: {
    rawMarket: IGateioMarketSchema,
  }): IAlunaMarketSchema {

    // TODO implement me

    throw new Error('not implemented')

  }

  public static parseMany (params: {
    rawMarkets: IGateioMarketSchema[],
  }): IAlunaMarketSchema[] {

    // TODO implement me

    throw new Error('not implemented')

    const parsedMarkets = params.rawMarkets.map(
      (rawMarket) => GateioMarketModule.parse({
        rawMarket,
      }),
    )

    GateioLog.info(`parsed ${parsedMarkets.length} markets for Gateio`)

    return parsedMarkets

  }

}
