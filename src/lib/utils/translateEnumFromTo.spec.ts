import { ValrOrderTypesEnum } from '../../exchanges/valr/lib/enums/ValrOrderTypesEnum'
import { OrderTypesEnum } from '../enums/OrderTypeEnum'
import { translateEnumFromTo } from './translateEnumFromTo'



/*
  App enums
*/
const alunaToValr = translateEnumFromTo({
  string: OrderTypesEnum.LIMIT,
  from: OrderTypesEnum,
  to: ValrOrderTypesEnum,
})

const valrToAluna = translateEnumFromTo({
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

const bToA = translateEnumFromTo({
  string: enumB.KEY_A,
  from: enumB,
  to: enumA,
})

const aToB = translateEnumFromTo({
  string: enumA.KEY_A,
  from: enumA,
  to: enumB,
})

console.log({
  bToA,
  aToB,
})
