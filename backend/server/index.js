const express = require("express");
const { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } = require("@solana/web3.js");
const { serialize } = require("borsh");
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
    const connection = new Connection(process.env.DEVNET_RPC, "confirmed");
    const keypairBytes = JSON.parse(fs.readFileSync("./keypair.json", "utf8"));
    const keypair = Keypair.fromSecretKey(new Uint8Array(keypairBytes));
    const programId = new PublicKey("4kHscyfUExLgCVbDF2ivdKicf4NC9tp1SX88FGxnb7GW");

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
        const snippetPDA = PublicKey.findProgramAddressSync(
          [Buffer.from("snippet"), authorPubkey.toBuffer()],
          programId
        )[0];

        // Define instruction data schema
        const instructionDataSchema = {
          struct: {
            instructionDiscriminator: { array: { type: "u8", len: 8 } },
            title: "string",
            contentHash: "string",
          },
        };

        // Serialize instruction data
        const instructionData = {
          instructionDiscriminator: [140, 135, 194, 182, 171, 195, 145, 31], // From mythforge.json
          title,
          contentHash,
        };
        const serializedData = serialize(instructionDataSchema, instructionData);

        // Create instruction
        const instruction = {
          programId,
          keys: [
            { pubkey: snippetPDA, isSigner: false, isWritable: true },
            { pubkey: authorPubkey, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          data: serializedData,
        };

        // Create and send transaction
        const transaction = new Transaction().add(instruction);
        const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);

        // Store in MongoDB
        await db.collection("snippets").insertOne({
          title,
          contentHash,
          author: author.toString(),
          snippetPDA: snippetPDA.toString(),
          createdAt: new Date(),
        });

        res.json({ status: "Snippet submitted", snippetPDA: snippetPDA.toString(), signature });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Placeholder for mint-nft and read-snippet (to be added after submit-snippet works)
    app.post("/mint-nft", async (req, res) => {
      res.json({ status: "Not implemented yet" });
    });

    app.post("/read-snippet", async (req, res) => {
      res.json({ status: "Not implemented yet" });
    });

    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();