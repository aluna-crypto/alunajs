# AlunaJS / Integration Tests

Make sure exchange integratons are working.

# TL;DR

This will run all tets again _**all**_ implemented exchanges.

```
yarn test-e2e
```

## AlunaRC
> Before moving on, be sure to set up your `.alunarc`:
> - [Setting up `.alunarc`](../../docs/alunarc.md)


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
