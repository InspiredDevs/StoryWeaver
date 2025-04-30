use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("4kHscyfUExLgCVbDF2ivdKicf4NC9tp1SX88FGxnb7GW");

#[program]
pub mod mythforge {
    use super::*;

    pub fn initialize_snippet(
        ctx: Context<InitializeSnippet>,
        title: String,
        content_hash: String,
        nonce: String,
    ) -> Result<()> {
        let snippet = &mut ctx.accounts.snippet;
        snippet.author = *ctx.accounts.author.key;
        snippet.title = title;
        snippet.content_hash = content_hash;
        snippet.nonce = nonce; // Use nonce
        snippet.nft_minted = false;
        Ok(())
    }

    pub fn mint_nft(ctx: Context<MintNFT>) -> Result<()> {
        let snippet = &mut ctx.accounts.snippet;
        require!(!snippet.nft_minted, ErrorCode::NFTAlreadyMinted);

        // Mint NFT logic (simplified, integrate Metaplex later)
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.nft_mint.to_account_info(),
                    to: ctx.accounts.nft_account.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            1, // 1 NFT
        )?;

        snippet.nft_minted = true;
        Ok(())
    }

    pub fn read_snippet(ctx: Context<ReadSnippet>) -> Result<()> {
        require!(
            ctx.accounts.nft_account.amount >= 1,
            ErrorCode::NoNFTOwnership
        );
        // Return snippet data (handled off-chain)
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, content_hash: String, nonce: String)]
pub struct InitializeSnippet<'info> {
    #[account(
        init,
        payer = author,
        space = 8 + 32 + (4 + 64) + (4 + 32) + (4 + 32) + 1, // Discriminator + Pubkey + Title (4+64) + ContentHash (4+32) + Nonce (4+32) + Bool
        seeds = [b"snippet", author.key().as_ref(), nonce.as_bytes()],
        bump
    )]
    pub snippet: Account<'info, Snippet>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(mut, has_one = author)]
    pub snippet: Account<'info, Snippet>,
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub nft_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReadSnippet<'info> {
    pub snippet: Account<'info, Snippet>,
    pub nft_account: Account<'info, TokenAccount>,
}

#[account]
pub struct Snippet {
    pub author: Pubkey,
    pub title: String,
    pub content_hash: String,
    pub nonce: String,
    pub nft_minted: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("NFT already minted for this snippet")]
    NFTAlreadyMinted,
    #[msg("User does not own the required NFT")]
    NoNFTOwnership,
}