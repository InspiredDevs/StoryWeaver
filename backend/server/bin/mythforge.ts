import * as anchor from "@coral-xyz/anchor";

export type Mythforge = {
  version: "0.1.0";
  name: "mythforge";
  address: "4kHscyfUExLgCVbDF2ivdKicf4NC9tp1SX88FGxnb7GW";
  metadata: {
    name: "mythforge";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "initializeSnippet";
      discriminator: [140, 135, 194, 182, 171, 195, 145, 31];
      accounts: [
        { name: "snippet"; writable: true; pda: { seeds: [{ kind: "const"; value: number[] }, { kind: "account"; path: "author" }] } },
        { name: "author"; writable: true; signer: true },
        { name: "systemProgram"; address: "11111111111111111111111111111111" }
      ];
      args: [{ name: "title"; type: "string" }, { name: "contentHash"; type: "string" }];
    },
    {
      name: "mintNft";
      discriminator: [211, 57, 6, 167, 15, 219, 35, 251];
      accounts: [
        { name: "snippet"; writable: true },
        { name: "nftMint"; writable: true },
        { name: "nftAccount"; writable: true },
        { name: "author"; writable: true; signer: true; relations: ["snippet"] },
        { name: "authority"; signer: true },
        { name: "tokenProgram"; address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { name: "systemProgram"; address: "11111111111111111111111111111111" }
      ];
      args: [];
    },
    {
      name: "readSnippet";
      discriminator: [129, 242, 108, 215, 237, 30, 115, 185];
      accounts: [{ name: "snippet" }, { name: "nftAccount" }];
      args: [];
    }
  ];
  accounts: [
    {
      name: "Snippet";
      discriminator: [91, 192, 233, 29, 55, 25, 94, 59];
      type: {
        kind: "struct";
        fields: [
          { name: "author"; type: "pubkey" },
          { name: "title"; type: "string" },
          { name: "contentHash"; type: "string" },
          { name: "nftMinted"; type: "bool" }
        ];
      };
    }
  ];
  errors: [
    { code: 6000; name: "NFTAlreadyMinted"; msg: "NFT already minted for this snippet" },
    { code: 6001; name: "NoNFTOwnership"; msg: "User does not own the required NFT" }
  ];
};

export const IDL: Mythforge = {
  version: "0.1.0",
  name: "mythforge",
  address: "4kHscyfUExLgCVbDF2ivdKicf4NC9tp1SX88FGxnb7GW",
  metadata: {
    name: "mythforge",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
  },
  instructions: [
    {
      name: "initializeSnippet",
      discriminator: [140, 135, 194, 182, 171, 195, 145, 31],
      accounts: [
        {
          name: "snippet",
          writable: true,
          pda: { seeds: [{ kind: "const", value: [115, 110, 105, 112, 112, 101, 116] }, { kind: "account", path: "author" }] }
        },
        { name: "author", writable: true, signer: true },
        { name: "systemProgram", address: "11111111111111111111111111111111" }
      ],
      args: [{ name: "title", type: "string" }, { name: "contentHash", type: "string" }]
    },
    {
      name: "mintNft",
      discriminator: [211, 57, 6, 167, 15, 219, 35, 251],
      accounts: [
        { name: "snippet", writable: true },
        { name: "nftMint", writable: true },
        { name: "nftAccount", writable: true },
        { name: "author", writable: true, signer: true, relations: ["snippet"] },
        { name: "authority", signer: true },
        { name: "tokenProgram", address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { name: "systemProgram", address: "11111111111111111111111111111111" }
      ],
      args: []
    },
    {
      name: "readSnippet",
      discriminator: [129, 242, 108, 215, 237, 30, 115, 185],
      accounts: [{ name: "snippet" }, { name: "nftAccount" }],
      args: []
    }
  ],
  accounts: [
    {
      name: "Snippet",
      discriminator: [91, 192, 233, 29, 55, 25, 94, 59],
      type: {
        kind: "struct",
        fields: [
          { name: "author", type: "pubkey" },
          { name: "title", type: "string" },
          { name: "contentHash", type: "string" },
          { name: "nftMinted", type: "bool" }
        ]
      }
    }
  ],
  errors: [
    { code: 6000, name: "NFTAlreadyMinted", msg: "NFT already minted for this snippet" },
    { code: 6001, name: "NoNFTOwnership", msg: "User does not own the required NFT" }
  ]
};