# Insistent

A simple library to retry functions.

> This documentation is a work in progress.

- [Installation](#installation)
- [Usage](#usage)
  - [Basic use case](#basic-use-case)
  - [Reusability](#reusability)
- [Options](#options)
  - [`retryWhen`](#retrywhen)
  - [`maxRetries`](#maxretries)
  - [`retryInterval`](#retryinterval)
  - [`incrementIntervalWith`](#incrementintervalwith)
- [License](#license)

## Installation

``` bash
npm install @guilhermemj/insistent
```

## Usage

> Tip: There are some examples with basic and advanced usage in the [examples](./examples) folder.

### Basic use case

Simply import the package and call the `insistOn` function to encapsulate your not-so-sure-it-will-run code. Keep in mind that `insistOn` will return a Promise and must be handled accordingly.

Also note that insistent will forward the target function's return so you can use it inside `.then()`.

``` javascript
var insistent = require("@guilhermemj/insistent");

function getNumberOrThrowError() {
  // Math.random returns a number between 0 and 1
  var number = Math.random();

  if (number > 0.2) {
    return number;
  }

  throw new Error("You're out of luck!")
}

insistent.insistOn(() => getNumberOrThrowError(), { maxRetries: 10 })
  .then((number) => console.log("Success! Your number is " + number))
  .catch((error) => console.log("Failed several attempts. Last error was " + error.message));
```

### Reusability

It's possible to create an insistent instance with custom options to use in functions with similar error handling.

We will use Typescript with async/await in the example to improve readability.

``` typescript
import { createInsistent } from "@guilhermemj/insistent";
import externalApi from "some-random-service";

const MINUTE_IN_MS = 60000;

// External API is often unavailable so we try each request multiple times
const insistOnRequest = createInsistent({
  maxRetries: 5,
  retryInterval: 2 * MINUTE_IN_MS,
  retryWhen: (error) => error.response?.status === 503,
});

(async () => {
  try {
    const customerDetails = await insistOnRequest(
      async () => await externalApi.getCustomerDetails(),
    );

    const customerWishlist = await insistOnRequest(
      async () => await externalApi.getWishlist(customerDetails.wishlistId),
    );

    // Product list is the most intermitent endpoint so we insist on it more times
    const productList = await insistOnRequest(
      async () => await externalApi.getProducts(customerWishlist.productIds),
      { maxRetries: 10 },
    );

    /// Do more code...
  } catch (error) {
    console.error("External API must be down", error);
  }
})();
```

## Options

`insistOn` function accepts an options object as second argument for different needs. The same options are used in `createInsistent`.

### `retryWhen`

- **Type:** `(error: any) => boolean`
- **Default:** `() => true`

Determines whether an exception is worth retrying or not (e.g., only retry 503 request errors). By default any error will trigger another try.

### `maxRetries`

- **Type:** `number`
- **Default:** `3`

The maximum amount of attempts the code can execute before throwing.

### `retryInterval`

- **Type:** `number`
- **Default:** `0`

How long (in milliseconds) the code must wait before retrying the function. `retryInterval` must be greater than or equal 0.

### `incrementIntervalWith`

- **Type:** `(lastValue: number) => number`
- **Default:** `(lastValue) => lastValue`

Defines a function to increment `retryInterval` after each attempt. By default, never changes given interval.

Examples:

- `incrementIntervalWith: (lastValue) => lastValue * 2,`: Double interval on each attempt.
- `incrementIntervalWith: (lastValue) => lastValue + 1000,`: Wait one more second after each attempt.

> Tip: One can also use predefined intervals instead of arbitrary calculations. [See example](./examples/predefinedIntervals.js)

## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
