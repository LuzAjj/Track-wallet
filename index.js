import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { CHAINS } from './chains.js';
import { toLowerList } from './utils.js';
import { startMonitor } from './monitor.js';

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
if (!TG_TOKEN || !TG_CHAT_ID) throw new Error('Set TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID');

const bot = new Telegraf(TG_TOKEN);

// Siapkan addresses per chain dari env
for (const chain of CHAINS) {
  chain.addresses = toLowerList(chain.addrsEnv);
}

// Command sederhana
bot.start((ctx) => ctx.reply('Upbit inflow hunter aktif ✅'));
bot.help((ctx) => ctx.reply('Bot memantau inflow ERC-20 ke alamat Upbit yang kamu set di .env'));

(async () => {
  console.log('Launching Upbit Multichain Inflow Hunter Bot…');
  await bot.launch();

  for (const chain of CHAINS) {
    try { await startMonitor(chain, bot); }
    catch (e) { console.error(`[${chain.name}] failed:`, e?.message || e); }
  }

  console.log('Bot is running. Ctrl+C untuk stop.');
})();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
