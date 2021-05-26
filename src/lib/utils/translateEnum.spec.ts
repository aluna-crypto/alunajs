import { ValrOrderTypesEnum } from '../../exchanges/valr/lib/enums/ValrOrderTypesEnum'
import { OrderTypesEnum } from '../enums/OrderTypeEnum'
import { translateEnum } from './translateEnum'



/*
  App enums
*/
const alunaToValr = translateEnum({
  string: OrderTypesEnum.LIMIT,
  from: OrderTypesEnum,
  to: ValrOrderTypesEnum,
})

const valrToAluna = translateEnum({
  string: ValrOrderTypesEnum.LIMIT,
  from: ValrOrderTypesEnum,
  to: OrderTypesEnum,
})

console.log({
  alunaToValr,
  valrToAluna,
})



/*
  Example enums
*/
enum enumA {
  KEY_A = 'enumA:A',
  KEY_B = 'enumA:B',
  KEY_C = 'enumA:C',
  KEY_D = 'enumA:D',
}

enum enumB {
  KEY_A = 'enumB:A',
  KEY_B = 'enumB:B',
  KEY_C = 'enumB:C',
  KEY_D = 'enumB:D',
}

const bToA = translateEnum({
  string: enumB.KEY_A,
  from: enumB,
  to: enumA,
})

const aToB = translateEnum({
  string: enumA.KEY_A,
  from: enumA,
  to: enumB,
})

console.log({
  bToA,
  aToB,
})
