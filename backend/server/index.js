const express = require("express");
const { AnchorProvider, Program } = require("@coral-xyz/anchor");
const { Connection, PublicKey } = require("@solana/web3.js");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

const connection = new Connection(process.env.DEVNET_RPC, "confirmed");
const provider = new AnchorProvider(connection, null, {});
const programId = new PublicKey("4kHscyfUExLgCVbDF2ivdKicf4NC9tp1SX88FGxnb7GW");
const idl = require("../mythforge/target/idl/mythforge.json");
const program = new Program(idl, programId, provider);

app.post("/submit-snippet", async (req, res) => {
  try {
    const { title, contentHash, author } = req.body;
    const authorPubkey = new PublicKey(author);
    const snippetPDA = PublicKey.findProgramAddressSync(
      [Buffer.from("snippet"), authorPubkey.toBuffer()],
      programId
    )[0];

    await program.methods
      .initializeSnippet(title, contentHash)
      .accounts({
        snippet: snippetPDA,
        author: authorPubkey,
        systemProgram: require("@solana/web3.js").SystemProgram.programId,
      })
      .rpc();

    res.json({ status: "Snippet submitted", snippetPDA: snippetPDA.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));