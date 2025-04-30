const { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const { createMint, createAccount, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const fs = require("fs");

async function createTestMintAndTokenAccount() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const keypairBytes = JSON.parse(fs.readFileSync("./keypair.json", "utf8"));
  const payer = Keypair.fromSecretKey(new Uint8Array(keypairBytes));

  // Create mint
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey, // mint authority
    null, // freeze authority
    0 // decimals
  );

  // Create token account
  const tokenAccount = await createAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log("Mint Public Key:", mint.toString());
  console.log("Token Account Public Key:", tokenAccount.toString());
}

createTestMintAndTokenAccount().catch(console.error);