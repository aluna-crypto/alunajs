import { Aluna } from './Aluna'



/*
  Matrix of all implemented exchanges
*/
console.log(Aluna.exchanges)



/*
  Instantiating (via static resolver)
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
// valr1.Order.get({ id: 123 }).then(console.log).catch(console.error)



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
// valr2.Order.get({ id: 123 }).then(console.log).catch(console.error)
