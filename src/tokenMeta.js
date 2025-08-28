import { ethers } from 'ethers';

const ERC20_IFACE = new ethers.Interface([
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function name() view returns (string)',
]);

const cache = new Map(); // token -> {symbol, decimals, name}

export async function readTokenMeta(provider, token) {
  if (cache.has(token)) return cache.get(token);
  const c = new ethers.Contract(token, ERC20_IFACE, provider);
  let [symbol, decimals, name] = ['?', 18, '?'];
  try { symbol = await c.symbol(); } catch {}
  try { decimals = await c.decimals(); } catch {}
  try { name = await c.name(); } catch {}
  const meta = { symbol, decimals: Number(decimals), name };
  cache.set(token, meta);
  return meta;
}
