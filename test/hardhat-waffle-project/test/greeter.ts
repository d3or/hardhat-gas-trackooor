// @ts-nocheck
// tslint:disable-next-line no-implicit-dependencies
import { assert, expect } from "chai";
import { ethers, waffle } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = new GasTracker(await Greeter.deploy("Hello, world!"), {
      logAfterTx: true,
    })
    await greeter.setGreeting("Hola, mundo!");
    expect(await greeter.greet()).to.equal("Hola, mundo!");
    console.log(greeter.gasData);
  });
});