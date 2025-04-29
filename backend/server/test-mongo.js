const { connectToMongo } = require("./mongo");

async function testConnection() {
  try {
    const { client, db } = await connectToMongo();
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    await client.close();
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exit(1);
  }
}

testConnection();