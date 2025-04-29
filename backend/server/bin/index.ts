import express, { Request, Response } from "express";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Mythforge, IDL } from "./mythforge";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Solana connection and program
const connection = new Connection(process.env.DEVNET_RPC!, "confirmed");
const dummyKeypair = Keypair.generate();
const wallet = new Wallet(dummyKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
const programId = new PublicKey("4kHscyfUExLgCVbDF2ivdKicf4NC9tp1SX88FGxnb7GW");

let program: Program<Mythforge>;
try {
  program = new Program<Mythforge>(IDL, programId, provider);
  console.log("Program initialized successfully");
} catch (error: any) {
  console.error("Failed to initialize Program:", error.message);
  process.exit(1);
}

// Health endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Server running" });
});

app.post("/submit-snippet", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));