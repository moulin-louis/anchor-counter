import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  AnchorWallet,
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import { createContext, useContext } from "react";
import { Counter } from '../../target/types/counter.ts'
import IDL from '../../target/idl/counter.json'

import "@solana/wallet-adapter-react-ui/styles.css";
import TransactionTest from "./TransactionTest";
import { Keypair } from "@solana/web3.js";


export const counterAccount = Keypair.generate();


export const ProgramAnchorContext = createContext<Program<Counter> | null>(null)

export const useProgram = () => {
  return useContext(ProgramAnchorContext);
}

function ProgramAnchorProvider({ children }) {
  const wallet = useWallet();
  const connectionState = useConnection();
  if (wallet.connected === false) {
    return (<>
      <ProgramAnchorContext.Provider value={null}>
        {children}
      </ProgramAnchorContext.Provider >
    </>)
  }
  const provider = new AnchorProvider(connectionState.connection, wallet as AnchorWallet, {
    commitment: 'confirmed'
  })
  const program = new Program<Counter>(IDL as Counter, provider);
  return (
    <ProgramAnchorContext.Provider value={program}>
      {children}
    </ProgramAnchorContext.Provider>
  )

}

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  // You can also provide a custom RPC endpoint.
  const endpoint = "http://localhost:8899";

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <ProgramAnchorProvider>
            <TransactionTest />
          </ProgramAnchorProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
