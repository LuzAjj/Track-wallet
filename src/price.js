// Best-effort price via DexScreener (tak semua token ada datanya)
export async function getDexScreenerPriceUSD(slug, token) {
  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${token}`;
    const r = await fetch(url, { headers: { 'accept': 'application/json' } });
    const j = await r.json();
    if (!j?.pairs?.length) return null;
    // coba cari pair di chain yang sama
    const pair = j.pairs.find(p => (p.chainId || '').toLowerCase() === slug) || j.pairs[0];
    const priceUsd = Number(pair?.priceUsd || 0);
    return Number.isFinite(priceUsd) && priceUsd > 0 ? priceUsd : null;
  } catch {
    return null;
  }
}
