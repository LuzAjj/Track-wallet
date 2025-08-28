import { ethers } from 'ethers';
import { TRANSFER_TOPIC, toTopicAddr } from './utils.js';
import { readTokenMeta } from './tokenMeta.js';
import { getDexScreenerPriceUSD } from './price.js';
import { sendAlert } from './alerts.js';

const MIN_RAW = BigInt(process.env.MIN_RAW_AMOUNT || '0');
const MIN_USD = Number(process.env.MIN_USD || '0');
const HTTP_POLL_INTERVAL = Number(process.env.HTTP_POLL_INTERVAL || '12');

// state
const seenTokensPerChain = new Map(); // chain.key -> Set(token)
const seenLogs = new Map();           // chain.key -> Set(txHash#index)

async function handleLog(chain, bot, provider, log) {
  const key = `${log.transactionHash}#${log.index}`;
  if (!seenLogs.has(chain.key)) seenLogs.set(chain.key, new Set());
  const bag = seenLogs.get(chain.key);
  if (bag.has(key)) return;
  bag.add(key);

  let parsed;
  try {
    const iface = new ethers.Interface([
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ]);
    parsed = iface.parseLog(log);
  } catch {
    return;
  }

  const token = ethers.getAddress(log.address);
  const from = ethers.getAddress(parsed.args.from);
  const to = ethers.getAddress(parsed.args.to);
  const value = parsed.args.value;

  if (MIN_RAW > 0n && value < MIN_RAW) return;

  const meta = await readTokenMeta(provider, token);
  const amountHuman = Number(value) / 10 ** meta.decimals;

  let priceUsd = null;
  try {
    priceUsd = await getDexScreenerPriceUSD(chain.slug, token);
  } catch {}

  if (MIN_USD > 0 && priceUsd && amountHuman * priceUsd < MIN_USD) return;

  if (!seenTokensPerChain.has(chain.key)) seenTokensPerChain.set(chain.key, new Set());
  const seenTokens = seenTokensPerChain.get(chain.key);
  const isNewToken = !seenTokens.has(token);
  if (isNewToken) seenTokens.add(token);

  await sendAlert(bot, {
    chainName: chain.name,
    chainSlug: chain.slug,
    explorer: chain.explorer,
    from, to, token,
    amountHuman,
    symbol: meta.symbol,
    name: meta.name,
    txHash: log.transactionHash,
    isNewToken,
    priceUsd
  });
}

export async function startMonitor(chain, bot) {
  const addresses = chain.addresses;
  if (!addresses.length) {
    console.log(`[${chain.name}] skip (no Upbit addrs in env)`);
    return;
  }

  let provider;
  let mode = 'wss';
  if (chain.wss) provider = new ethers.WebSocketProvider(chain.wss);
  else if (chain.http) { provider = new ethers.JsonRpcProvider(chain.http); mode = 'http'; }
  else { console.log(`[${chain.name}] skip (no RPC)`); return; }

  const toTopics = addresses.map(a => toTopicAddr(a));
  const filter = { topics: [TRANSFER_TOPIC, null, toTopics] };

  console.log(`[${chain.name}] monitoring (${mode}) → ${addresses.length} addr`);

  if (mode === 'wss') {
    provider.on(filter, (log) => handleLog(chain, bot, provider, log).catch(console.error));
    provider._websocket?.on('close', () => {
      console.error(`[${chain.name}] WSS closed; exiting so supervisor can restart`);
      process.exit(1);
    });
  } else {
    let fromBlock = await provider.getBlockNumber();
    setInterval(async () => {
      try {
        const latest = await provider.getBlockNumber();
        const toBlock = latest;
        const from = Math.max(fromBlock - 3, latest - 2500);
        const logs = await provider.getLogs({ ...filter, fromBlock: from, toBlock });
        for (const log of logs) await handleLog(chain, bot, provider, log);
        fromBlock = latest + 1;
      } catch (e) {
        console.error(`[${chain.name}] polling error`, e?.message || e);
      }
    }, HTTP_POLL_INTERVAL * 1000);
  }
}
