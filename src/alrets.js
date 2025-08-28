import { Markup } from 'telegraf';
import { links } from './utils.js';

const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
if (!CHAT_ID) throw new Error('Set TELEGRAM_CHAT_ID in .env');

export async function sendAlert(bot, {
  chainName, chainSlug, explorer, from, to, token, amountHuman,
  symbol, name, txHash, isNewToken, priceUsd
}) {
  const title = isNewToken ? '🆕 NEW TOKEN TO UPBIT' : '📥 Inflow to Upbit';
  const usdText = (priceUsd && amountHuman)
    ? ` (~$${(priceUsd * amountHuman).toLocaleString(undefined, { maximumFractionDigits: 2 })})`
    : '';

  const msg =
`<b>${title}</b> — <b>${chainName}</b>
Token: <code>${name} (${symbol})</code>
Amount: <b>${amountHuman}</b>${usdText}
From: <code>${from}</code>
To:   <code>${to}</code>`;

  const buttons = Markup.inlineKeyboard([
    [
      Markup.button.url('🔎 TX', links.tx(explorer, txHash)),
      Markup.button.url('🧾 Token', links.token(explorer, token)),
      Markup.button.url('📈 DexScreener', links.dexs(chainSlug, token)),
    ]
  ]);

  await bot.telegram.sendMessage(CHAT_ID, msg, { parse_mode: 'HTML', ...buttons });
}
