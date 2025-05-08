use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};
use mpl_token_metadata::{
    instructions::{CreateMetadataAccountV3, CreateMetadataAccountV3InstructionArgs},
    types::{Creator, DataV2},
};

declare_id!("4kHscyfUExLgCVbDF2ivdKicf4NC9tp1SX88FGxnb7GW");

#[program]
pub mod mythforge {
    use super::*;

    pub fn initialize_snippet(ctx: Context<InitializeSnippet>, title: String, content_hash: String) -> Result<()> {
        let snippet = &mut ctx.accounts.snippet;
        snippet.author = ctx.accounts.author.key();
        snippet.title = title;
        snippet.content_hash = content_hash;
        snippet.nft_minted = false;
        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNft>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let snippet = &mut ctx.accounts.snippet;
        require!(!snippet.nft_minted, MythforgeError::NFTAlreadyMinted);

        // Mint NFT to author's token account
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.nft_mint.to_account_info(),
                    to: ctx.accounts.nft_account.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            1,
        )?;

        // Prepare creator array
        let creators = vec![
            Creator {
                address: ctx.accounts.author.key(),
                verified: true,
                share: 95, // Author gets 95%
            },
            Creator {
                address: ctx.accounts.platform_wallet.key(),
                verified: false,
                share: 5,  // Platform gets 5%
            },
        ];

        // Create metadata account
        let metadata_instruction = CreateMetadataAccountV3 {
            metadata: ctx.accounts.metadata.key(),
            mint: ctx.accounts.nft_mint.key(),
            mint_authority: ctx.accounts.authority.key(),
            payer: ctx.accounts.author.key(),
            update_authority: (ctx.accounts.author.key(), true), // Tuple with Pubkey and signer status
            system_program: ctx.accounts.system_program.key(),
            rent: Some(ctx.accounts.rent.key()),
        }
        .instruction(CreateMetadataAccountV3InstructionArgs {
            data: DataV2 {
                name,
                symbol,
                uri,
                seller_fee_basis_points: 500, // 5% seller fee
                creators: Some(creators),
                collection: None,
                uses: None,
            },
            is_mutable: true,
            collection_details: None,
        });

        let accounts = [
            ctx.accounts.metadata.to_account_info(),
            ctx.accounts.nft_mint.to_account_info(),
            ctx.accounts.authority.to_account_info(),
            ctx.accounts.author.to_account_info(),
            ctx.accounts.author.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ];

        anchor_lang::solana_program::program::invoke(&metadata_instruction, &accounts)?;

        snippet.nft_minted = true;
        Ok(())
    }

    pub fn read_snippet(ctx: Context<ReadSnippet>) -> Result<()> {
        let snippet = &ctx.accounts.snippet;
        require!(snippet.nft_minted, MythforgeError::NFTNotMinted);

        let nft_account = &ctx.accounts.nft_account;
        require!(
            nft_account.amount >= 1,
            MythforgeError::NoNFTOwnership
        );
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String, content_hash: String)]
pub struct InitializeSnippet<'info> {
    #[account(
        init,
        payer = author,
        space = 8 + 32 + 4 + title.len() + 4 + content_hash.len() + 1,
        seeds = [b"snippet", author.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub snippet: Account<'info, Snippet>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut, has_one = author)]
    pub snippet: Account<'info, Snippet>,
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub nft_account: Account<'info, TokenAccount>,
    /// CHECK: This is the metadata account, initialized by Metaplex
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    #[account(mut)]
    pub fee_account: Signer<'info>,
    /// CHECK: Platform wallet receives royalties
    pub platform_wallet: UncheckedAccount<'info>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    /// CHECK: Metaplex metadata program
    pub metadata_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ReadSnippet<'info> {
    pub snippet: Account<'info, Snippet>,
    #[account(
        constraint = nft_account.mint == snippet.key() @ MythforgeError::InvalidNFT
    )]
    pub nft_account: Account<'info, TokenAccount>,
}

#[account]
pub struct Snippet {
    pub author: Pubkey,
    pub title: String,
    pub content_hash: String,
    pub nft_minted: bool,
}

#[error_code]
pub enum MythforgeError {
    #[msg("NFT already minted for this snippet")]
    NFTAlreadyMinted,
    #[msg("NFT not yet minted for this snippet")]
    NFTNotMinted,
    #[msg("User does not own the required NFT")]
    NoNFTOwnership,
    #[msg("Invalid NFT for this snippet")]
    InvalidNFT,
    #[msg("Insufficient mint fee")]
    InsufficientMintFee,
    #[msg("Failed to create metadata account")]
    MetadataCreationFailed,
}