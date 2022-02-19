// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";

import "../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.5.8",
};

export default config;
