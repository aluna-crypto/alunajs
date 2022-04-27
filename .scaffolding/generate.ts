import { AlunaAccountEnum } from '../src/lib/enums/AlunaAccountEnum'
import { AlunaApiFeaturesEnum } from '../src/lib/enums/AlunaApiFeaturesEnum'



export interface IScaffoldSettings {
  exchangeName: string
  tradingFeatures: AlunaAccountEnum[]
  apiFeatures: AlunaApiFeaturesEnum[]
}



export async function generate (settings: IScaffoldSettings) {
  console.log(JSON.stringify(settings, null, 2))
}
