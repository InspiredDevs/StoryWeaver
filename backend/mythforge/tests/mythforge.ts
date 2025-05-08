import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createMint, createAccount } from '@solana/spl-token';
import { Mythforge } from '../target/types/mythforge';
import { assert } from 'chai';

async function withRetry<T>(fn: () => Promise<T>, retries: number = 5, delayMs: number = 2000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`Retry ${i + 1}/${retries} failed: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw new Error('Retry logic failed');
}

describe('mythforge', () => {
  // Use Devnet provider
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const provider = new anchor.AnchorProvider(connection, anchor.Wallet.local(), {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed'
  });
  anchor.setProvider(provider);
  const program = anchor.workspace.Mythforge as Program<Mythforge>;

  const author = provider.wallet;
  const title = `Test Snippet ${Date.now()}`;
  const nonce = Date.now().toString(); // Use nonce for PDA
  const contentHash = 'QmTestHash1234567890abcdef1234567890abcdef12';
  const name = 'StoryWeaver NFT';
  const symbol = 'STORY';
  const uri = 'https://storyweaver.app/nft/test.json';

  let snippetPDA: PublicKey;
  let nftMint: Keypair;
  let nftAccount: PublicKey;
  let feeAccount: Keypair;
  let platformWallet: Keypair;
  let metadataPDA: PublicKey;

  before(async () => {
    // Verify connection
    try {
      const version = await withRetry(() => connection.getVersion());
      console.log(`Connected to Devnet: ${JSON.stringify(version)}`);
    } catch (error) {
      console.error('Failed to connect to Devnet:', error);
      throw new Error('Devnet connection failed. Check network or try again.');
    }

    // Check wallet balance
    try {
      const balance = await withRetry(() => provider.connection.getBalance(author.publicKey));
      console.log(`Author wallet: ${author.publicKey.toBase58()}`);
      console.log(`Author wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
      assert(balance >= 1 * LAMPORTS_PER_SOL, 'Author wallet needs at least 1 SOL');
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      throw error;
    }

    // Derive snippet PDA with nonce
    try {
      [snippetPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('snippet'), author.publicKey.toBuffer(), Buffer.from(nonce)],
        program.programId
      );
      console.log(`Snippet PDA: ${snippetPDA.toBase58()}`);
    } catch (error) {
      console.error('Failed to derive snippet PDA:', error);
      throw error;
    }

    // Create NFT mint
    nftMint = Keypair.generate();
    try {
      await withRetry(() =>
        createMint(
          provider.connection,
          author.payer,
          author.publicKey,
          null,
          0,
          nftMint
        )
      );
      console.log(`NFT mint created: ${nftMint.publicKey.toBase58()}`);
    } catch (error) {
      console.error('Failed to create mint:', error);
      throw error;
    }

    // Create NFT token account
    try {
      nftAccount = await withRetry(() =>
        createAccount(
          provider.connection,
          author.payer,
          nftMint.publicKey,
          author.publicKey,
          Keypair.generate()
        )
      );
      console.log(`NFT token account created: ${nftAccount.toBase58()}`);
    } catch (error) {
      console.error('Failed to create token account:', error);
      throw error;
    }

    // Load fee and platform accounts from mythforge/keys/
    try {
      feeAccount = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(require('fs').readFileSync('./keys/fee_account.json')))
      );
      platformWallet = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(require('fs').readFileSync('./keys/platform_wallet.json')))
      );
      console.log(`Fee account: ${feeAccount.publicKey.toBase58()}`);
      console.log(`Platform wallet: ${platformWallet.publicKey.toBase58()}`);
    } catch (error) {
      console.error('Failed to load keypairs from mythforge/keys/:', error);
      throw error;
    }

    // Check fee account balance
    try {
      const balance = await withRetry(() => provider.connection.getBalance(feeAccount.publicKey));
      console.log(`Fee account balance: ${balance / LAMPORTS_PER_SOL} SOL`);
      assert(balance >= 0.1 * LAMPORTS_PER_SOL, 'Fee account needs at least 0.1 SOL');
    } catch (error) {
      console.error('Failed to get fee account balance:', error);
      throw error;
    }

    // Derive metadata PDA
    const metadataProgram = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    try {
      [metadataPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          metadataProgram.toBuffer(),
          nftMint.publicKey.toBuffer(),
        ],
        metadataProgram
      );
      console.log(`Metadata PDA: ${metadataPDA.toBase58()}`);
    } catch (error) {
      console.error('Failed to derive metadata PDA:', error);
      throw error;
    }
  });

  it('Initializes a snippet', async () => {
    try {
      await program.methods
        .initializeSnippet(title, contentHash, nonce)
        .accounts({
          snippet: snippetPDA,
          author: author.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log('Snippet initialized');
    } catch (error) {
      console.error('Failed to initialize snippet:', error);
      throw error;
    }

    const snippet = await program.account.snippet.fetch(snippetPDA);
    assert.equal(snippet.author.toBase58(), author.publicKey.toBase58());
    assert.equal(snippet.title, title);
    assert.equal(snippet.contentHash, contentHash);
    assert.equal(snippet.nonce, nonce);
    assert.equal(snippet.nftMinted, false);
  });

  it('Mints an NFT with 5% royalty', async () => {
    try {
      await program.methods
        .mintNft(name, symbol, uri)
        .accounts({
          snippet: snippetPDA,
          nftMint: nftMint.publicKey,
          nftAccount: nftAccount,
          metadata: metadataPDA,
          feeAccount: feeAccount.publicKey,
          platformWallet: platformWallet.publicKey,
          author: author.publicKey,
          authority: author.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([feeAccount])
        .rpc();
      console.log('NFT minted');
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      if (error.logs) {
        console.error('Transaction logs:', error.logs);
      }
      throw error;
    }

    const snippet = await program.account.snippet.fetch(snippetPDA);
    assert.equal(snippet.nftMinted, true);

    const nftAccountInfo = await provider.connection.getTokenAccountBalance(nftAccount);
    assert.equal(nftAccountInfo.value.uiAmount, 1);
  });

  it('Reads a snippet with NFT ownership', async () => {
    try {
      await program.methods
        .readSnippet()
        .accounts({
          snippet: snippetPDA,
          nftAccount: nftAccount,
        })
        .rpc();
      console.log('Snippet read with NFT ownership');
    } catch (error) {
      console.error('Failed to read snippet:', error);
      if (error.logs) {
        console.error('Transaction logs:', error.logs);
      }
      throw error;
    }
  });

  it('Fails to read without NFT ownership', async () => {
    const emptyAccount = await createAccount(
      provider.connection,
      author.payer,
      nftMint.publicKey,
      author.publicKey,
      Keypair.generate()
    );

    try {
      await program.methods
        .readSnippet()
        .accounts({
          snippet: snippetPDA,
          nftAccount: emptyAccount,
        })
        .rpc();
      assert.fail('Should have failed');
    } catch (error) {
      console.error('Expected error for reading without NFT:', error.message);
      assert.include(error.message, 'User does not own the required NFT');
    }
  });

  it('Fails to mint with insufficient fee', async () => {
    const newTitle = `New Snippet ${Date.now()}`;
    const newNonce = Date.now().toString();
    const newSnippetPDA = (await PublicKey.findProgramAddress(
      [Buffer.from('snippet'), author.publicKey.toBuffer(), Buffer.from(newNonce)],
      program.programId
    ))[0];

    await program.methods
      .initializeSnippet(newTitle, contentHash, newNonce)
      .accounts({
        snippet: newSnippetPDA,
        author: author.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const emptyFeeAccount = Keypair.generate();

    try {
      await program.methods
        .mintNft(name, symbol, uri)
        .accounts({
          snippet: newSnippetPDA,
          nftMint: nftMint.publicKey,
          nftAccount: nftAccount,
          metadata: metadataPDA,
          feeAccount: emptyFeeAccount.publicKey,
          platformWallet: platformWallet.publicKey,
          author: author.publicKey,
          authority: author.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([emptyFeeAccount])
        .rpc();
      assert.fail('Should have failed');
    } catch (error) {
      console.error('Expected error for insufficient fee:', error.message);
      assert.include(error.message, 'Insufficient mint fee');
    }
  });
});