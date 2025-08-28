export const CHAINS = [
  {
    key: 'ethereum',
    name: 'Ethereum',
    slug: 'ethereum',                 // dexscreener slug
    explorer: 'https://etherscan.io',
    wss: process.env.ETHEREUM_WSS,
    http: process.env.ETHEREUM_HTTP,
    addrsEnv: process.env.UPBIT_ETHEREUM_ADDRS || '',
  },
  {
    key: 'bsc',
    name: 'BNB Smart Chain',
    slug: 'bsc',
    explorer: 'https://bscscan.com',
    wss: process.env.BSC_WSS,
    http: process.env.BSC_HTTP,
    addrsEnv: process.env.UPBIT_BSC_ADDRS || '',
  },
  {
    key: 'arbitrum',
    name: 'Arbitrum',
    slug: 'arbitrum',
    explorer: 'https://arbiscan.io',
    wss: process.env.ARBITRUM_WSS,
    http: process.env.ARBITRUM_HTTP,
    addrsEnv: process.env.UPBIT_ARBITRUM_ADDRS || '',
  },
  {
    key: 'base',
    name: 'Base',
    slug: 'base',
    explorer: 'https://basescan.org',
    wss: process.env.BASE_WSS,
    http: process.env.BASE_HTTP,
    addrsEnv: process.env.UPBIT_BASE_ADDRS || '',
  },
  {
    key: 'klaytn',
    name: 'Klaytn',
    slug: 'klaytn',
    explorer: 'https://klaytnscope.com',
    wss: process.env.KLAYTN_WSS,
    http: process.env.KLAYTN_HTTP,
    addrsEnv: process.env.UPBIT_KLAYTN_ADDRS || '',
  },
  // tambahkan chain lain di sini…
];
