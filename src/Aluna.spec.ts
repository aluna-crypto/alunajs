import {
  Aluna,
} from './Aluna'



/*
  Matrix of all implemented exchanges
*/
console.log(Aluna.exchanges)



/*
  Public (via static shortcuts)
*/
console.log(Aluna.Valr.ID)

Aluna.Valr.Symbol.list().then(console.log).catch(console.error)
Aluna.Valr.Market.list().then(console.log).catch(console.error)



/*
  Public (via static resolver)
*/
const Valr = Aluna.static({
  exchangeId: 'valr',
})

console.log(Valr.ID)

Valr.Symbol.list().then(console.log).catch(console.error)
Valr.Market.list().then(console.log).catch(console.error)



/*
  Instantiating (via resolver)
*/
export const valr1 = Aluna.new({
  exchangeId: 'valr',
  keySecret: {
    key: 'asdf',
    secret: 'asdf',
  },
})

valr1.Balance.list().then(console.log).catch(console.error)
valr1.Order.list().then(console.log).catch(console.error)
valr1.Order.get({
  id: 123,
}).then(console.log).catch(console.error)



/*
  Instantiating (via static shortcut)
*/
export const valr2 = new Aluna.Valr({
  keySecret: {
    key: 'asdf',
    secret: 'asdf',
  },
})

valr2.Balance.list().then(console.log).catch(console.error)
valr2.Order.list().then(console.log).catch(console.error)
valr2.Order.get({
  id: 123,
}).then(console.log).catch(console.error)
