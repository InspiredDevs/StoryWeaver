const express = require("express");
const { Connection, Keypair, PublicKey, SystemProgram, TOKEN_PROGRAM_ID } = require("@solana/web3.js");
const { Program, AnchorProvider, web3 } = require("@coral-xyz/anchor");
const fs = require("fs");
const { connectToMongo } = require("./mongo");

const app = express();
app.use(express.json());

let db;
async function startServer() {
  try {
    // Connect to MongoDB
    const { client, db: mongoDb } = await connectToMongo();
    db = mongoDb;
    console.log("MongoDB ready");

    // Initialize Solana connection
    const connection = new Connection(process.env.DEVNET_RPC || "https://api.devnet.solana.com", "confirmed");
    const keypairBytes = JSON.parse(fs.readFileSync("./keypair.json", "utf8"));
    const serverKeypair = Keypair.fromSecretKey(new Uint8Array(keypairBytes));
    const provider = new AnchorProvider(connection, { publicKey: serverKeypair.publicKey, signTransaction: async (tx) => tx }, { commitment: "confirmed" });
    const idl = JSON.parse(fs.readFileSync("./mythforge.json", "utf8"));
    const program = new Program(idl, provider);

    // Load fee and platform wallets
    const feeAccount = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync("../mythforge/keys/fee_account.json", "utf8")))
    );
    const platformWallet = new PublicKey(
      JSON.parse(fs.readFileSync("../mythforge/keys/platform_wallet.json", "utf8"))
    );

    // Health endpoint
    app.get("/health", (req, res) => {
      res.json({ status: "Server running", mongo: "Connected", solana: "Connected" });
    });

    // Test MongoDB endpoint
    app.get("/test-mongo", async (req, res) => {
      try {
        const collections = await db.listCollections().toArray();
        res.json({ collections: collections.map(c => c.name) });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Submit Snippet endpoint
    app.post("/submit-snippet", async (req, res) => {
      try {
        const { title, contentHash, author } = req.body;
        if (!title || !contentHash || !author) {
          return res.status(400).json({ error: "Missing required fields" });
        }
        const authorPubkey = new PublicKey(author);
        const nonce = Date.now().toString();
        const [snippetPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("snippet"), authorPubkey.toBuffer(), Buffer.from(nonce)],
          program.programId
        );

        // Build transaction
        const tx = await program.methods
          .initializeSnippet(title, contentHash, nonce)
          .accounts({
            snippet: snippetPDA,
            author: authorPubkey,
            systemProgram: SystemProgram.programId,
          })
          .transaction();

        // Send transaction (requires author signature from client)
        const signature = await connection.sendRawTransaction(tx.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });
        await connection.confirmTransaction(signature, "confirmed");

        // Store in MongoDB
        await db.collection("snippets").insertOne({
          title,
          contentHash,
          author: author.toString(),
          snippetPDA: snippetPDA.toString(),
          nonce,
          createdAt: new Date(),
        });

        res.json({ status: "Snippet submitted", snippetPDA: snippetPDA.toString(), signature });
      } catch (error) {
        console.error("Submit snippet error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Mint NFT endpoint
    app.post("/mint-nft", async (req, res) => {
      try {
        const { snippetPDA, mint, tokenAccount, author, name, symbol, uri } = req.body;
        if (!snippetPDA || !mint || !tokenAccount || !author || !name || !symbol || !uri) {
          return res.status(400).json({ error: "Missing required fields" });
        }
        const snippetPubkey = new PublicKey(snippetPDA);
        const mintPubkey = new PublicKey(mint);
        const tokenAccountPubkey = new PublicKey(tokenAccount);
        const authorPubkey = new PublicKey(author);

        // Derive metadata PDA
        const metadataProgram = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
        const [metadataPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("metadata"), metadataProgram.toBuffer(), mintPubkey.toBuffer()],
          metadataProgram
        );

        // Build transaction
        const tx = await program.methods
          .mintNft(name, symbol, uri)
          .accounts({
            snippet: snippetPubkey,
            nftMint: mintPubkey,
            nftAccount: tokenAccountPubkey,
            metadata: metadataPDA,
            feeAccount: feeAccount.publicKey,
            platformWallet: platformWallet,
            author: authorPubkey,
            authority: authorPubkey,
            tokenProgram: TOKEN_PROGRAM_ID,
            metadataProgram: metadataProgram,
            systemProgram: SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .signers([feeAccount])
          .transaction();

        // Send transaction (requires author signature from client)
        const signature = await connection.sendRawTransaction(tx.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });
        await connection.confirmTransaction(signature, "confirmed");

        // Update MongoDB
        await db.collection("snippets").updateOne(
          { snippetPDA: snippetPDA },
          { $set: { nftMinted: true, updatedAt: new Date() } }
        );

        res.json({ status: "NFT minted", signature });
      } catch (error) {
        console.error("Mint NFT error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Read Snippet endpoint
    app.post("/read-snippet", async (req, res) => {
      try {
        const { snippetPDA, tokenAccount } = req.body;
        if (!snippetPDA || !tokenAccount) {
          return res.status(400).json({ error: "Missing required fields" });
        }
        const snippetPubkey = new PublicKey(snippetPDA);
        const tokenAccountPubkey = new PublicKey(tokenAccount);

        // Build transaction
        const tx = await program.methods
          .readSnippet()
          .accounts({
            snippet: snippetPubkey,
            nftAccount: tokenAccountPubkey,
          })
          .transaction();

        // Send transaction
        const signature = await connection.sendRawTransaction(tx.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });
        await connection.confirmTransaction(signature, "confirmed");

        // Fetch snippet data from MongoDB
        const snippet = await db.collection("snippets").findOne({ snippetPDA: snippetPDA });
        if (!snippet) {
          return res.status(404).json({ error: "Snippet not found" });
        }

        res.json({ status: "Snippet accessible", snippet, signature });
      } catch (error) {
        console.error("Read snippet error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();