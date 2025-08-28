import { ethers } from 'ethers';

export const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');

export const toLowerList = (s) =>
  s.split(',').map(x => x.trim()).filter(Boolean).map(x => x.toLowerCase());

export const toTopicAddr = (addrLower) => ethers.zeroPadValue(addrLower, 32);

export const links = {
  tx: (explorer, txHash) => `${explorer}/tx/${txHash}`,
  token: (explorer, token) => `${explorer}/token/${token}`,
  addr: (explorer, addr) => `${explorer}/address/${addr}`,
  dexs: (slug, token) => `https://dexscreener.com/${slug}/${token}`,
};
