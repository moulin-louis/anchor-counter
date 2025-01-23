import { useWallet } from '@solana/wallet-adapter-react';
import { counterAccount, useProgram } from './App';
import { useState } from 'react';
import { BN } from 'bn.js';


export default function TransactionTest() {
  const [count, setCount] = useState(new BN(0));
  const program = useProgram();
  const wallet = useWallet();
  const onClickInit = async () => {
    try {
      const tx = await program?.methods.initialize().accounts({
        signer: wallet.publicKey,
        counter: counterAccount.publicKey,
      }).signers([counterAccount]).rpc();
      console.log('tx init = ', tx);
    } catch (e) {
      e.getLogs();
    }

  }
  const onClickFetch = async () => {
    const state = await program?.account.counter.fetch(counterAccount.publicKey);
    console.log('state account count = ', state?.count)
    if (!state) {
      console.error('fetch failed')
      return
    }
    setCount(state.count);
  }
  const onClickIncrement = async () => {
    const tx = await program?.methods.increment().accounts({
      counter: counterAccount.publicKey
    }).rpc();
    console.log('tx increment: ', tx)
    await onClickFetch();
  }

  return (
    <div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={onClickInit}>
          Init
        </button>
        <button onClick={onClickFetch}>
          Fetch Data
        </button>
        <button onClick={onClickIncrement}>
          Increment
        </button>
        count = {count.toString()}
      </div>
    </div>
  )
}
