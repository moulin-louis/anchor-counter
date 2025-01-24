import { useWallet } from '@solana/wallet-adapter-react';
import { counterAccount, useProgram } from './App';
import { useState } from 'react';
import { BN } from 'bn.js';


export default function TransactionTest() {
  const [count, setCount] = useState(new BN(0));
  const [assignValue, setAssignValue] = useState('0'); // Declare a state variable...
  const program = useProgram();
  const wallet = useWallet();
  const onClickInit = async () => {
    if (!wallet.publicKey)
      throw new Error("wallet not connected")
    const tx = await program?.methods.initialize().accounts({
      signer: wallet.publicKey,
      counter: counterAccount.publicKey,
    }).signers([counterAccount]).rpc();
    console.log('tx init = ', tx);
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
  const onClickAssign = async () => {
    const tx = await program?.methods.assign(new BN(assignValue)).accounts({
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
        <button onClick={onClickIncrement}>
          Increment
        </button>
        <button onClick={onClickAssign}>
          <input name="assign-input" value={assignValue} onChange={(e) => setAssignValue(e.target.value)} />
          Assign a value
        </button>
        count = {count.toString()}
      </div>
    </div>
  )
}
