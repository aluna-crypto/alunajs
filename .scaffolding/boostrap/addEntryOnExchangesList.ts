import { join } from 'path'

import { replaceSync } from '../utils/replaceSync'
import { IBoostrapMethodParams } from './IBoostrapMethodParams'



export const addEntryOnExchangesList = (
  params: IBoostrapMethodParams,
) => {

  const {
    // log,
    // settings,
    paths: { SRC },
    configs: { exchangeLower },
  } = params

  const el = exchangeLower
  const import1 = `import { ${el} } from '../exchanges/${el}'`
  const import2 = `import { ${el}BaseSpecs } from '../exchanges/${el}/${el}Specs'`

  const importsSearch = 'import'
  const importsReplace = `${import1}\n${import2}\n${importsSearch}`

  const definitionSearch = 'export const exchanges = {'
  const definitionReplace = `${definitionSearch}\n  [${el}BaseSpecs.id]: ${el},`

  const exchangesFilepath = join(SRC, 'lib', 'exchanges.ts')

  const buildCondition = (term: string) => (contents: string) => {
    return (contents.indexOf(term) === -1)
  }

  replaceSync({
    filepath: exchangesFilepath,
    search: importsSearch,
    replace: importsReplace,
    condition: buildCondition(exchangeLower),
  })

  replaceSync({
    filepath: exchangesFilepath,
    search: definitionSearch,
    replace: definitionReplace,
    condition: buildCondition(definitionReplace),
  })

}
