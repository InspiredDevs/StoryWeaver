const express = require("express");
const { AnchorProvider, Program, Wallet, BorshAccountsCoder } = require("@coral-xyz/anchor");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.json());

// Load IDL
let idl;
try {
  idl = JSON.parse(fs.readFileSync("./mythforge.json", "utf8"));
  console.log("IDL accounts:", idl.accounts);
} catch (error) {
  console.error("Failed to load IDL:", error.message);
  process.exit(1);
}

// Calculate Snippet account size
const SNIPPET_ACCOUNT_SIZE = 8 + // discriminator
                            32 + // author (Pubkey)
                            4 + 50 + // title (String, max 50 chars)
                            4 + 64 + // content_hash (String, max 64 chars)
                            1; // nft_minted (bool)

// Inject size into IDL
idl.accounts.find(acc => acc.name === "Snippet").size = SNIPPET_ACCOUNT_SIZE;

// Initialize Solana connection and program
const connection = new Connection(process.env.DEVNET_RPC, "confirmed");
const dummyKeypair = Keypair.generate();
const wallet = new Wallet(dummyKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
const programId = new PublicKey("4kHscyfUExLgCVbDF2ivdKicf4NC9tp1SX88FGxnb7GW");

let program;
try {
  program = new Program(idl, programId, provider);
  console.log("Program initialized successfully");
} catch (error) {
  console.error("Failed to initialize Program:", error.message);
  process.exit(1);
}

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server running" });
});

app.post("/submit-snippet", async (req, res) => {
  try {
    const { title, contentHash, author } = req.body;
    if (!title || !contentHash || !author) {
      return res.status(400).json({ error: "Missing required fields" });
    }
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