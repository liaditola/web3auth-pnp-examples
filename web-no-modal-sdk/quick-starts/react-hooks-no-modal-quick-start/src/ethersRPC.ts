/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

const getChainId = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    // Get the connected Chain's ID
    const networkDetails = await ethersProvider.getNetwork();
    return networkDetails.chainId.toString();
  } catch (error) {
    return error;
  }
}

const getAccounts = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = signer.getAddress();

    return await address;
  } catch (error) {
    return error;
  }
}

const getBalance = async (provider: IProvider): Promise<string> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = signer.getAddress();
    const rawBalance = await ethersProvider.getBalance(address);
    
    console.log("Printing raw balance");
    console.log(JSON.stringify(provider));
    console.log(rawBalance);
    console.log("Done printing raw balance");

    // Get user's balance in ether
    const balance = ethers.formatEther(
      rawBalance
    );
    return balance;
  } catch (error) {
    return error as string;
  }
}

const getUSDTBalance = async (provider: IProvider): Promise<string> => {
  try {

    /////////////////////////////////////////////////////////////////////////////////////
    // this is not the full ERC20 ABI - but only the 2 functions needed for this demo.
    const ERC20_ABI = [
      // ABI for the decimals() function:
      {
          "constant": true,
          "inputs": [],
          "name": "decimals",
          "outputs": [
              {
                  "name": "",
                  "type": "uint8"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
      },

      // ABI for the getBalance() function:
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_owner",
                  "type": "address"
              }
          ],
          "name": "balanceOf",
          "outputs": [
              {
                  "name": "balance",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
      },
    ] ;

    const contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
  
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = signer.getAddress();
    

    // take the ABI, give it to ethers.js so we can call things like `.balanceOf(address)` or `.decimals()`.
    const usdtErc20Contract = new ethers.Contract(
      contractAddress,
      ERC20_ABI,
      ethers.getDefaultProvider());

    // magic of JS, we can now call any function defined in the ABI, and ethers.js knows what arguments to send
    const balance = await usdtErc20Contract.balanceOf(address);
    const numDecimals = await usdtErc20Contract.decimals();

    // balance is an ethers BigNumber, so we can use .div() on it
    const formattedBalance = BigInt(balance) / BigInt(10n ** numDecimals);

    console.log(`DEBUG: balance of ${address} for contract ${contractAddress} is ${balance} and something else is ${numDecimals} with result => ${formattedBalance}`);
  

    /////////////////////////////////////////////////////////////////////////////////////


    return formattedBalance.toString();
  } catch (error) {
    return error as string;
  }
}

const sendTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    const destination = "<put-destination-wallet-address>";

    const amount = ethers.parseEther("0.0005");
    const fees = await ethersProvider.getFeeData()

    // Submit transaction to the blockchain
    const tx = await signer.sendTransaction({
      to: destination,
      value: amount,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas, // Max priority fee per gas
      maxFeePerGas: fees.maxFeePerGas, // Max fee per gas
    });

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    return receipt;
  } catch (error) {
    return error as string;
  }
}

const signMessage = async (provider: IProvider): Promise<any> => {
  try {
    // For ethers v5
    // const ethersProvider = new ethers.providers.Web3Provider(provider);
    const ethersProvider = new ethers.BrowserProvider(provider);

    // For ethers v5
    // const signer = ethersProvider.getSigner();
    const signer = await ethersProvider.getSigner();
    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await signer.signMessage(originalMessage);

    return signedMessage;
  } catch (error) {
    return error as string;
  }
}

export default {getChainId, getAccounts, getBalance, getUSDTBalance, sendTransaction, signMessage};