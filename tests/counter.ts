import { describe, it, expect } from "vitest";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";

describe("counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.Counter as Program<Counter>;

  it("check initialize", async () => {
    let counter = anchor.web3.Keypair.generate();
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        counter: counter.publicKey,
        signer: provider.publicKey,
      })
      .signers([counter])
      .rpc();
  });

  it("check increment", async () => {
    let counterAccount = anchor.web3.Keypair.generate();
    // Add your test here.
    let tx = await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
        signer: provider.publicKey,
      })
      .signers([counterAccount])
      .rpc();
    console.log("account initialized: ", tx);

    tx = await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
      })
      .rpc();
    console.log("account incremented: ", tx);

    const counter = await program.account.counter.fetch(
      counterAccount.publicKey
    );

    expect(counter.count.eq(new anchor.BN(1))).toBe(true);
  });

  it("check assign", async () => {
    let counterAccount = anchor.web3.Keypair.generate();
    let tx = await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
        signer: provider.publicKey,
      })
      .signers([counterAccount])
      .rpc();
    console.log("account initialized: ", tx);

    tx = await program.methods
      .assign(new anchor.BN(42))
      .accounts({
        counter: counterAccount.publicKey,
      })
      .rpc();
    console.log("account assigned: ", tx);

    const counter = await program.account.counter.fetch(
      counterAccount.publicKey
    );

    expect(counter.count.eq(new anchor.BN(42))).toBe(true);
  });

  it("check increment overflow error", async () => {
    let counterAccount = anchor.web3.Keypair.generate();
    let tx = await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
        signer: provider.publicKey,
      })
      .signers([counterAccount])
      .rpc();
    console.log("account initialized: ", tx);

    const u64Max = "18446744073709551615";
    tx = await program.methods
      .assign(new anchor.BN(u64Max))
      .accounts({
        counter: counterAccount.publicKey,
      })
      .rpc();

    const counter = await program.account.counter.fetch(
      counterAccount.publicKey
    );

    await expect(
      program.methods
        .increment()
        .accounts({ counter: counterAccount.publicKey })
        .rpc()
    ).rejects.toThrow(
      "AnchorError occurred. Error Code: Overflow. Error Number: 6000. Error Message: Runtime Increment Overflow."
    );
  });
});
