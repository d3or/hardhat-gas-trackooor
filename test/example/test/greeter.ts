import { expect } from 'chai';
import { ethers } from 'hardhat';
import { GasTracker } from 'hardhat';

describe('Greeter', function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory('Greeter');
    const greeter = new GasTracker(await Greeter.deploy('Hello, world!'), {
      logAfterTx: true,
    });
    // const greeter = await Greeter.deploy('Hello, world!');
    await greeter.setGreeting('Hola, mundo!');
    expect(await greeter.greet()).to.equal('Hola, mundo!');
    console.log(greeter.gasData);
  });
});
