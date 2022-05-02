import {
  balance,
  IWeb3BalanceModule,
} from './modules/balance'
import {
  IWeb3TokenModule,
  token,
} from './modules/token'



export class Web3 {

  public token: IWeb3TokenModule
  public balance: IWeb3BalanceModule



  constructor() {

    this.token = token(this)
    this.balance = balance(this)

    return this

  }

}
