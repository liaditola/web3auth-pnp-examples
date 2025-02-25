/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
import "./App.css";
import { useWeb3Auth } from "@web3auth/no-modal-react-hooks";
import { ADAPTER_STATUS, CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
// IMP START - Blockchain Calls
import RPC from "./ethersRPC";
// import RPC from "./viemRPC";
// import RPC from "./web3RPC";
// IMP END - Blockchain Calls

function App() {
  const { status, connectTo, userInfo, provider, logout, web3Auth } = useWeb3Auth();
  // const torusAdapter = new TorusWalletAdapter({
  //   sessionTime: 3600, // 1 hour in seconds
  //   // web3AuthNetwork: "sapphire_mainnet",
  //   // chainConfig: {
  //   //   chainNamespace: CHAIN_NAMESPACES.EIP155,
  //   //   chainId: "0x1",
  //   //   rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
  //   // },
  // });
  // web3Auth?.configureAdapter(torusAdapter);
  
  const newChain = {
    displayName: "Ethereum Mainnet",
    chainId: "0x1",
    rpcTarget: `https://rpc.ankr.com/eth`,
    blockExplorerUrl: "https://etherscan.io/",
    ticker: "USDT",
    tickerName: "Tether stablecoin cryptocurrency",
    logo: "https://images.toruswallet.io/eth.svg",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
  }
  web3Auth?.addChain(newChain);
  web3Auth?.switchChain({
    chainId: newChain.chainId
  });

  const login = async () => {
    // IMP START - Login
    await connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    // IMP END - Login
  };

  const logoutAction = async () => {
    // IMP START - Logout
    await logout();
    // IMP END - Logout
    uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
  // Check the RPC file for the implementation
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    const USDTBalance = await RPC.getUSDTBalance(provider);
    uiConsole(`ETH: ${balance}`, `USDT: ${USDTBalance}`);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    uiConsole(JSON.stringify(provider));
    const transactionReceipt = await RPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };
  // IMP END - Blockchain Calls

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logoutAction} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
          <h1 className="title">
            <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
              Web3Auth{" "}
            </a>
            & React Hooks No Modal Quick Start
          </h1>

          <div className="grid">{status === ADAPTER_STATUS.CONNECTED ? loggedInView : unloggedInView}</div>
          <div id="console" style={{ whiteSpace: "pre-line" }}>
            <p style={{ whiteSpace: "pre-line" }}></p>
          </div>

          <footer className="footer">
            <a
              href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/quick-starts/react-hooks-no-modal-quick-start"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code
            </a>
            <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fquick-starts%2Freact-hooks-no-modal-quick-start&project-name=react-hooks-no-modal-quick-start&repository-name=react-hooks-no-modal-quick-start">
              <img src="https://vercel.com/button" alt="Deploy with Vercel" />
            </a>
          </footer>
    </div>
  );
}

export default App;
