# hardhat-gas-trackooor
[Hardhat](http://gethardhat.com) plugin to track gas on the transaction level.
### Example report

![Example](https://i.imgur.com/gA6RBHM.png)

## Installation

```bash
npm install hardhat-gas-trackooor --save-dev
```

And add the following to your `hardhat.config.js`:
```js
require("hardhat-gas-trackooor");
```

Or, if you are using TypeScript, add this to your hardhat.config.ts:
```ts
import "hardhat-gas-trackooor"
```

## Usage
Inside your tests, wrap your contract with the GasTracker class:
```js
it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = new GasTracker(await Greeter.deploy("Hello, world!"), {
      logAfterTx: true,
    })
    await greeter.setGreeting("Hola, mundo!");
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
```
Then run
```
npx hardhat test
```
Example Output:
![output](https://imgur.com/FQ4Moj1.png)


Or, if you would like to specify which functions you want to get the gas for, you can use GetGas(transaction):
```js
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    const gas = await GetGas(await greeter.setGreeting("Hola, mundo!"));
    console.log('Gas used: '+gas);
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
```
**NOTE: GetGas() does not work with a GasTracker wrapped contract at the moment.**

Output:
![output](https://imgur.com/vHl0f7l.png)


If you do not want to log gas to the console but still want to take advantage of the gas logging, gas data from transactions are logged to `[wrappedContract].GasData`:
```js
it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = new GasTracker(await Greeter.deploy("Hello, world!"), {
      logAfterTx: false, // set to false so it doesn't log
    })
    await greeter.setGreeting("Hola, mundo!");
    expect(await greeter.greet()).to.equal("Hola, mundo!");

    // access gas data through greeter.GasData;
    const gasData = greeter.gasData;
    console.log(gasData);
});

```

### Options

There are not many options yet, feel free to make an issue or pull request if you want to add any.

| Option            | Type                   | Default                                                                    | Description                                                                                                                                                                                                                                  |
| ----------------- | ---------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| logAfterTx          | _Boolean_               | false                    | Log gas after each transaction                                                                                         

