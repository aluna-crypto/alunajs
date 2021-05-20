import { Valr } from './Valr'



console.log(Valr.ID)

Valr.Symbol.list()
  .then(console.log)
  .catch(console.error)

Valr.Market.list()
  .then(console.log)
  .catch(console.error)



const valr = new Valr({
  keySecret: {
    key: 'asdf',
    secret: 'asdf',
  },
  options: {
    // ...
  }
})

valr.Balance.list()
  .then(console.log)
  .catch(console.error)

valr.Order.list()
  .then(console.log)
  .catch(console.error)
