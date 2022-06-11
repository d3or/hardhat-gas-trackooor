import type * as ethers from 'ethers';

import { GasData, GasTrackerConfig } from './types';

export class GasTracker {
  public contract: ethers.Contract;

  public options: GasTrackerConfig;

  public gasData: GasData;

  public highGasThreshold: number = 100000;

  constructor(contract: ethers.Contract, options: GasTrackerConfig) {
    this.contract = contract;
    this.options = options;

    this.gasData = {}; // internal class storage for prev gas data, which can later be written to a file for other usage when needed
    /*
        Javascript proxy magic!
    */
    const handler = {
      get(obj: GasTracker, prop: string) {
        /*
                If the prop is just contract, then we return the contract object
                If the prob is connect, then we need to return the connect handler, which will handle gas logging when .connect is used.
            */
        if (prop === 'contract') {
          return obj.contract;
        }
        if (prop === 'gasData') {
          return obj.gasData;
        }
        if (prop === 'connect') {
          return this.connectHandler;
        }

        if (typeof obj.contract[prop] === 'function') {
          return async function (...args: (string | number)[]) {
            const response = await this.contract[prop](...args);
            /* 
                    if the response has a hash, that means the function call changed some state on the contract, i.e it took up gas, so we log the gas.
                */
            if (response?.hash) {
              await obj.logGas(args, prop, response.hash);
            }
            return response;
          };
        }

        // for getting certain properties from the contract, for example contract.address
        if (obj.contract[prop]) {
          return obj.contract[prop];
        }

        return async function (...args) {
          if (!obj.contract[prop] && !obj[prop]) {
            throw new Error(
              `${prop} is not a function or property of this contract`,
            );
          }
          // execute function
          // eslint-disable-next-line prefer-spread
          return obj[prop].apply(obj, args);
        };
      },

      /*  
        handles the case where .connect is used
        honestly, dont ask me why this works. but it does.
    */
      connectHandler(addr: string) {
        const connected = this.contract.connect(addr);
        const connectHandlerInner = {
          get(obj: GasTracker, prop: string) {
            return async function (...args: (string | number)[]) {
              // if it isnt a function, return the property value
              if (!connected.functions[prop]) {
                return obj[prop];
              }
              const response = await connected[prop](...args);
              if (response?.hash) {
                await obj.logGas(args, prop, response.hash);
              }
              return response;
            };
          },
        };
        return new Proxy(this, connectHandlerInner);
      },
    };

    return new Proxy(this, handler);
  }

  public async logGas(args: (string | number)[], prop: string, txHash: string) {
    // ok so, the hardhat runtime environment is exposed as a global variable, so we can access it here. but like idk how to type it. so we use @ts-ignore :D
    // @ts-ignore
    const reciept = await hre.ethers.provider.getTransactionReceipt(txHash);
    const gas = reciept.gasUsed.toNumber();

    let bullet = '•';
    if (gas > this.highGasThreshold) 
      bullet = ' ⚠️ ';

    if (this?.options?.logAfterTx) {
      console.log(
        `       ${bullet} ${prop} (${gas} gas) ${gas === 69420 ? 'nice.' : ''}`,
      );
    }
    // store gas data for later use / analysis
    this.gasData[txHash] = {
      gasUsed: gas,
      function: prop,
      args,
    };
  }
}
