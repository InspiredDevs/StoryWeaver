import { Connection } from '@solana/web3.js';

const QUICKNODE_URL = import.meta.env.VITE_QUICKNODE_URL;
export const solanaConnection = new Connection(QUICKNODE_URL, 'confirmed');