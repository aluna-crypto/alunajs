# AlunaJS / Integration Tests

This will run all tets again _**all**_ implemented exchanges.

```ts
yarn test-e2e
```

> _Requires `.alunarc` to be configured with keys and secrets.
> <sup>([**?**](http://github.com/alunacrypto/alunajs))</sup>_

# Customization

If you want to run e2e tests against a _**single**_ exchange, replace:

```ts
// test/e2e/index.ts
const exchangeIds = Object.keys(exchanges)
```

By this:

```ts
const exchangeIds = ['desiredExchangeId']
```


# Example output

```
  aluna
    — desiredExchangeId
      /public
        symbol
          ✔ listRaw (728ms)
          ✔ list
        market
          ✔ listRaw (858ms)
          ✔ list
      /authed
        key
          ✔ fetchDetails (1328ms)
        balance
          ✔ list
          ✔ listRaw
          ✔ getTradableBalance
        order
          1) list
          ✔ listRaw
          ✔ place
          ✔ edit
          ✔ cancel


  12 passing (6s)
  1 failing
```


# More
 - [Unit Tests](..)
